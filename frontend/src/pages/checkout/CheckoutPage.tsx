// src/pages/checkout/CheckoutPage.tsx
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const CheckoutPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const purchase = location.state?.purchase;

  // Redireciona para login se o usuário não estiver autenticado
  useEffect(() => {
    if (!user) {
      console.warn("🔒 Usuário não autenticado. Redirecionando para login.");
      navigate(`/login?redirect=/checkout`);
    }
  }, [user, navigate]);

  // Logs para debug
  useEffect(() => {
    console.log("🧾 Dados recebidos via location.state:", location.state);
    console.log("🛒 Dados brutos da compra:", purchase);
  }, [purchase, location.state]);

  // Validação da estrutura esperada
  if (
    !purchase ||
    !purchase.comprador ||
    typeof purchase.comprador.name !== "string" ||
    typeof purchase.comprador.email !== "string" ||
    typeof purchase.valor !== "number" ||
    !Array.isArray(purchase.eventos) ||
    !purchase.eventos.length
  ) {
    console.error("❌ Compra inválida. Dados ausentes ou incompletos:", purchase);
    return (
      <div className="text-center p-10">
        <h1 className="text-xl font-bold">Nenhuma compra encontrada</h1>
        <p className="text-muted-foreground mt-2">
          Por favor, inicie sua compra novamente.
        </p>
        <Button onClick={() => navigate("/")}>Voltar para o início</Button>
      </div>
    );
  }

  const enrichedPurchase = {
    ...purchase,
    descricao: "Pagamento de ingresso", // campo usado pelo backend
  };

  console.log("✅ Enriched Purchase:", enrichedPurchase);

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Escolha o método de pagamento</h1>
      <p className="text-muted-foreground mb-4">
        Total da compra: R$ {purchase.valor.toFixed(2)}
      </p>
      <div className="flex flex-col gap-4">
        <Button
          variant="default"
          onClick={() =>
            navigate("/checkout/pagamento/pix", {
              state: { purchase: enrichedPurchase },
            })
          }
        >
          Pagar com Pix
        </Button>

        <Button
          variant="outline"
          onClick={() =>
            navigate("/checkout/pagamento/cartao", {
              state: { purchase: enrichedPurchase },
            })
          }
        >
          Pagar com Cartão de Crédito
        </Button>
      </div>
    </div>
  );
};

export default CheckoutPage;
