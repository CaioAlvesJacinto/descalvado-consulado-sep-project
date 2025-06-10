// src/pages/Cart.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTicketCart } from "@/contexts/TicketCartContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import EmptyCart from "@/components/cart/EmptyCart";

const Cart = () => {
  const navigate = useNavigate();
  const {
    items: tickets,
    removeItem: removeTicket,
    clearCart: clearTickets,
  } = useTicketCart();

  const { isAuthenticated, user } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const totalItems = tickets.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = tickets.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const handleCheckout = () => {
    setIsCheckingOut(true);

    const enrichedItems = tickets.map((item) => ({
      eventoId: item.eventId,
      nameEvento: item.title,
      quantidade: item.quantity,
      unitPrice: item.price,
      totalPrice: item.quantity * item.price,
    }));

    const purchase = {
      valor: totalPrice,
      descricao: "Compra múltipla de ingressos",
      comprador: {
        name: user?.name || "Comprador",
        email: user?.email || "",
      },
      eventos: enrichedItems,
    };

    navigate("/checkout", { state: { purchase } });
  };


  if (!tickets.length) {
    return (
      <Layout>
        <div className="container py-12 md:py-16">
          <EmptyCart />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8 md:py-12">
        <Button variant="ghost" asChild className="mb-8">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continuar comprando
          </Link>
        </Button>

        <h1 className="text-3xl font-bold mb-8">Seu Carrinho</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {tickets.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={() => removeTicket(item.id)}
              />
            ))}
          </div>
          <div>
            <CartSummary
              totalItems={totalItems}
              totalPrice={totalPrice}
              isAuthenticated={isAuthenticated}
              isCheckingOut={isCheckingOut}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
