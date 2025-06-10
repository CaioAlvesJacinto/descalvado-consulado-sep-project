// src/components/cart/CartItem.tsx
import { Button } from "@/components/ui/button";
import { CartItem as CartItemType } from "@/types/cart";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface CartItemProps {
  item: CartItemType;
  onRemove: () => void;
}

const CartItem = ({ item, onRemove }: CartItemProps) => {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => onRemove(), 300);
  };

  return (
    <div
      className={cn(
        "flex gap-4 p-4 border rounded-lg bg-card transition-all duration-300",
        isRemoving ? "opacity-0 translate-x-4" : "opacity-100"
      )}
    >
      <div className="flex-1">
        <div className="flex justify-between">
          <h3 className="font-medium">{item.title}</h3>
          <span className="font-medium">
            R$ {(item.price * item.quantity).toFixed(2)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">Qtd: {item.quantity}</p>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive mt-2"
          onClick={handleRemove}
        >
          Remover
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
