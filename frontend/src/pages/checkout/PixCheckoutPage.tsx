import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface EventoItem {
  eventoId: string;
  nameEvento: string;
  quantidade: number;
  unitPrice: number;
  totalPrice: number;
}

interface Purchase {
  comprador: {
    name: string;
    email: string;
  };
  valor: number;
  descricao: string;
  eventos: EventoItem[];
}

const PixCheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const purchase = location.state?.purchase as Purchase | undefined;

  const [qrCodeBase64, setQrCodeBase64] = useState("");
  const [copyPasteCode, setCopyPasteCode] = useState("");
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [redirectMsg, setRedirectMsg] = useState(false);
  const [forceLoading, setForceLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  // Gera o pagamento Pix
  useEffect(() => {
    if (
      !purchase ||
      !purchase.comprador?.name ||
      !purchase.comprador?.email ||
      !purchase.valor ||
      !Array.isArray(purchase.eventos) ||
      !purchase.eventos.length
    ) {
      setError("Compra inválida. Dados ausentes.");
      setLoading(false);
      return;
    }

    const generatePix = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axios.post(`${API_URL}/pagamentos/pix`, purchase, {
          headers: { "Content-Type": "application/json" },
        });

        const qr = data?.data?.point_of_interaction?.transaction_data;
        const id = data?.data?.id?.toString();

        if (!qr?.qr_code_base64 || !qr.qr_code || !id) {
          throw new Error("Resposta do servidor incompleta.");
        }

        setQrCodeBase64(qr.qr_code_base64);
        setCopyPasteCode(qr.qr_code);
        setTransactionId(id);
      } catch (err: any) {
        const mensagem =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Erro inesperado ao gerar Pix.";
        console.error("❌ Erro ao gerar Pix:", err);
        setError(mensagem);
      } finally {
        setLoading(false);
      }
    };

    generatePix();
  }, [purchase, API_URL]);

  // Polling do status do pagamento
  useEffect(() => {
    if (!transactionId) return;

    const interval = setInterval(async () => {
      try {
        const { data } = await axios.get(`${API_URL}/pagamentos/status/${transactionId}`);
        if (data.status === "approved") {
          clearInterval(interval);
          setRedirectMsg(true);
          setTimeout(() => navigate("/meus-ingressos"), 2000);
        }
      } catch (err) {
        // Silencia o erro para evitar poluição de log
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [transactionId, navigate, API_URL]);

  const handleCopy = () => {
    navigator.clipboard.writeText(copyPasteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Novo: Força atualização manual (chama o webhook do backend)
  const handleForceWebhook = async () => {
    if (!transactionId) return;
    setForceLoading(true);
    try {
      await axios.post(`${API_URL}/pagamentos/webhook`, {
        type: "payment",
        data: { id: transactionId }
      });
      // Após forçar, consulta status
      const { data } = await axios.get(`${API_URL}/pagamentos/status/${transactionId}`);
      if (data.status === "approved") {
        setRedirectMsg(true);
        setTimeout(() => navigate("/meus-ingressos"), 2000);
      } else {
        alert("Pagamento ainda não aprovado. Aguarde alguns segundos e tente novamente.");
      }
    } catch (err) {
      alert("Erro ao atualizar status. Tente novamente.");
    } finally {
      setForceLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center text-lg">🔄 Gerando QR Code Pix…</p>;
  }

  if (error) {
    return (
      <div className="text-center text-red-600 mt-8">
        <p className="text-xl font-semibold">❌ Falha ao gerar Pix</p>
        <p className="mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 text-center">
      <h2 className="text-xl font-semibold mb-2">Pagamento via Pix</h2>
      <p className="text-muted-foreground mb-4">
        Escaneie o QR Code ou copie o código abaixo para finalizar o pagamento.
      </p>

      {qrCodeBase64 && (
        <img
          src={`data:image/png;base64,${qrCodeBase64}`}
          alt={`QR Code Pix para pagamento de R$ ${purchase?.valor.toFixed(2)}`}
          className="mx-auto"
        />
      )}

      {copyPasteCode && (
        <>
          <p className="mt-4 break-all text-sm font-mono">{copyPasteCode}</p>
          <Button onClick={handleCopy} className="mt-2">
            {copied ? "✅ Copiado!" : "📋 Copiar código Pix"}
          </Button>
        </>
      )}

      {/* Botão para forçar atualização manual */}
      {transactionId && !redirectMsg && (
        <Button
          onClick={handleForceWebhook}
          className="mt-4"
          variant="outline"
          disabled={forceLoading}
        >
          {forceLoading ? "Atualizando..." : "Já paguei! Atualizar agora"}
        </Button>
      )}

      {redirectMsg && (
        <p className="text-green-600 mt-6 text-sm">
          ✅ Pagamento aprovado! Redirecionando para seus ingressos...
        </p>
      )}
    </div>
  );
};

export default PixCheckoutPage;
