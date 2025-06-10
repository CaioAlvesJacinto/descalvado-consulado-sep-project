import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const MP_PUBLIC_KEY = import.meta.env.VITE_MP_PUBLIC_KEY!;
const API_URL = import.meta.env.VITE_API_URL!;

const CardCheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const purchase = location.state?.purchase;
  const isProduction = import.meta.env.PROD;

  // Endereço
  const [zipCode, setZipCode] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");

  // Cartão
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [holderName, setHolderName] = useState("");
  const [document, setDocument] = useState("");
  const [installments, setInstallments] = useState(1);
  const [paymentMethodId, setPaymentMethodId] = useState("");
  const [issuerId, setIssuerId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!purchase) {
    return (
      <div className="text-center p-10">
        <h1 className="text-xl font-bold">Compra não encontrada</h1>
        <p className="text-muted-foreground mt-2">Volte e selecione um ingresso novamente.</p>
        <Button onClick={() => navigate("/")}>Voltar para o início</Button>
      </div>
    );
  }

  // Busca método de pagamento pelo BIN
  useEffect(() => {
    const bin = cardNumber.replace(/\s+/g, "").slice(0, 6);
    if (bin.length !== 6) return;

    if (isProduction) {
      axios
        .get(`https://api.mercadopago.com/v1/payment_methods/search?bin=${bin}`, {
          headers: { Authorization: `Bearer ${import.meta.env.VITE_MP_ACCESS_TOKEN!}` },
        })
        .then(({ data }) => {
          const method = data.results[0];
          if (method) {
            setPaymentMethodId(method.id);
            setIssuerId(method.issuer?.id?.toString() || "");
          }
        })
        .catch(err => {
          console.error("Erro ao detectar método (produção):", err);
          setPaymentMethodId("");
          setIssuerId("");
        });
    } else {
      if (bin.startsWith("450995")) {
        setPaymentMethodId("visa");
        setIssuerId("1");
      } else if (bin.startsWith("503143")) {
        setPaymentMethodId("master");
        setIssuerId("24");
      } else {
        console.warn("BIN não reconhecido no sandbox:", bin);
        setPaymentMethodId("");
        setIssuerId("");
      }
    }
  }, [cardNumber, isProduction]);

  // Busca dados de endereço pelo CEP (ViaCEP)
  useEffect(() => {
    const fetchCep = async () => {
      if (zipCode.replace(/\D/g, "").length === 8) {
        try {
          const { data } = await axios.get(`https://viacep.com.br/ws/${zipCode}/json/`);
          if (!data.erro) {
            setStreet(data.logradouro || "");
            setBairro(data.bairro || "");
            setCidade(data.localidade || "");
            setUf(data.uf || "");
          }
        } catch (e) {
          // Silencie erros de CEP inválido
        }
      }
    };
    fetchCep();
  }, [zipCode]);

  const handlePayment = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      // Cria o token do cartão
      const { data: tokenRes } = await axios.post(
        `https://api.mercadopago.com/v1/card_tokens?public_key=${MP_PUBLIC_KEY}`,
        {
          card_number: cardNumber.replace(/\s+/g, ""),
          expiration_month: +expMonth,
          expiration_year: +expYear,
          security_code: cvv,
          cardholder: {
            name: holderName,
            identification: { type: "CPF", number: document.replace(/\D/g, "") },
          },
        },
        { headers: { "Content-Type": "application/json" } }
      );

      // Monta o payload
      const payload = {
        valor: purchase.valor,
        descricao: purchase.descricao || "Pagamento de ingresso",
        comprador: {
          ...purchase.comprador,
          name: holderName,
          tipoDocumento: "CPF",
          numeroDocumento: document,
        },
        cardToken: tokenRes.id,
        installments,
        paymentMethodId,
        issuerId,
        billingAddress: {
          street,
          number,
          zipCode,
          bairro,
          cidade,
          uf,
        },
        eventos: purchase.eventos,
      };

      const { data: resp } = await axios.post(
        `${API_URL}/pagamentos/card`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      alert(`✅ Pagamento aprovado! Status: ${resp.status?.toUpperCase() || resp.status}`);
      navigate("/meus-ingressos");
    } catch (error: any) {
      const status = error.response?.status;
      const detail =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message;

      if (status === 400) {
        alert("❌ Erro de validação: " + detail);
      } else if (status === 401 || status === 403) {
        alert("❌ Autenticação inválida.");
      } else {
        alert("❌ Falha no pagamento: " + detail);
      }
      console.error("Erro no pagamento:", error.response?.data || error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h2 className="text-xl font-semibold">Pagamento com Cartão</h2>

      <Input placeholder="Número do cartão" value={cardNumber} onChange={e => setCardNumber(e.target.value)} />
      <div className="flex gap-2">
        <Input placeholder="Mês (MM)" value={expMonth} onChange={e => setExpMonth(e.target.value)} />
        <Input placeholder="Ano (AAAA)" value={expYear} onChange={e => setExpYear(e.target.value)} />
      </div>
      <Input placeholder="CVV" value={cvv} onChange={e => setCvv(e.target.value)} />
      <Input placeholder="Nome do titular" value={holderName} onChange={e => setHolderName(e.target.value)} />
      <Input placeholder="CPF do titular" value={document} onChange={e => setDocument(e.target.value)} />

      {/* Endereço */}
      <Input placeholder="CEP" value={zipCode} maxLength={8} onChange={e => setZipCode(e.target.value.replace(/\D/g, ""))} />
      <Input placeholder="Rua" value={street} onChange={e => setStreet(e.target.value)} />
      <Input placeholder="Número" value={number} onChange={e => setNumber(e.target.value)} />
      <Input placeholder="Bairro" value={bairro} onChange={e => setBairro(e.target.value)} />
      <Input placeholder="Cidade" value={cidade} onChange={e => setCidade(e.target.value)} />
      <Input placeholder="UF" value={uf} maxLength={2} onChange={e => setUf(e.target.value)} />

      <Button onClick={handlePayment} disabled={!paymentMethodId || isProcessing}>
        {isProcessing ? "Processando..." : `Pagar R$ ${purchase.valor?.toFixed(2)}`}
      </Button>
    </div>
  );
};

export default CardCheckoutPage;
