import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link, useLocation } from "react-router-dom";

interface CartSummaryProps {
  totalItems: number;
  totalPrice: number;
  isAuthenticated: boolean;
  isCheckingOut: boolean;
  onCheckout: () => void;
}

const CartSummary = ({
  totalItems,
  totalPrice,
  isAuthenticated,
  isCheckingOut,
  onCheckout,
}: CartSummaryProps) => {
  const location = useLocation();

  return (
    <div className="sticky top-20 border rounded-lg p-6 bg-card">
      <h2 className="text-xl font-medium">Resumo do pedido</h2>

      <div className="mt-6 space-y-2">
        <div className="flex justify-between">
          <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'itens'})</span>
          <span>R$ {totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Entrega</span>
          <span>R$ 0.00</span>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="flex justify-between font-medium">
        <span>Total</span>
        <span>R$ {totalPrice.toFixed(2)}</span>
      </div>

      {!isAuthenticated ? (
        <div className="mt-6">
          <div className="bg-muted/50 rounded p-3 mb-4">
            <p className="text-sm">
              Faça login para continuar com a compra e acompanhar seus pedidos.
            </p>
          </div>
          <Button asChild className="w-full">
            <Link to="/login" state={{ from: location }}>
              Fazer login para continuar
            </Link>
          </Button>
        </div>
      ) : (
        <>
          <Button
            className="w-full mt-6"
            size="lg"
            onClick={onCheckout}
            disabled={isCheckingOut}
          >
            {isCheckingOut ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent mr-2" />
            ) : null}
            {isCheckingOut ? "Processando..." : "Finalizar pedido"}
          </Button>

          <div className="mt-4">
            <p className="text-xs text-muted-foreground text-center">
              Ao finalizar a compra, você concorda com nossos termos de serviço.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default CartSummary;
