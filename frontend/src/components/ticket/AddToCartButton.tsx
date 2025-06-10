import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Event } from "@/types/event";
import { useTicketCart } from "@/contexts/TicketCartContext"; // ✅ Hook correto
import { createCartTicketItem } from "@/types/cart";

interface AddToCartButtonProps {
  event: Event;
  quantity: number;
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg";
  className?: string;
  disabled?: boolean;
}

const AddToCartButton = ({
  event,
  quantity,
  variant = "default",
  size = "default",
  className = "",
  disabled = false,
}: AddToCartButtonProps) => {
  const { addItem } = useTicketCart(); // ✅ Correto

  const availableTickets = event.available_tickets;
  const isDisabled = disabled || availableTickets === 0 || quantity === 0;

  const handleAddToCart = () => {
    if (quantity > 0 && availableTickets >= quantity) {
      const ticketItem = createCartTicketItem(event, quantity);
      addItem(ticketItem); // ✅ Chamada certa
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      variant={variant}
      size={size}
      className={className}
      disabled={isDisabled}
    >
      <ShoppingCart className="h-4 w-4 mr-2" />
      {availableTickets === 0 ? "Esgotado" : "Adicionar ao Carrinho"}
    </Button>
  );
};

export default AddToCartButton;
