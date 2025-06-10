import React from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface SimpleQuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  maxQuantity?: number;
  availableTickets: number;
  size?: "sm" | "default";
  disabled?: boolean;
  min?: number;
}

const SimpleQuantitySelector = ({
  quantity,
  onQuantityChange,
  maxQuantity = 10,
  availableTickets,
  size = "default",
  disabled = false,
  min = 1,
}: SimpleQuantitySelectorProps) => {
  const max = Math.min(maxQuantity, availableTickets);

  const handleDecrease = () => {
    if (!disabled && quantity > min) onQuantityChange(quantity - 1);
  };

  const handleIncrease = () => {
    if (!disabled && quantity < max) onQuantityChange(quantity + 1);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        size={size}
        variant={quantity <= min || disabled ? "outline" : "default"}
        type="button"
        onClick={handleDecrease}
        disabled={disabled || quantity <= min}
        className="rounded-full p-2"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <input
        type="number"
        className={`w-12 text-center border border-input rounded font-bold focus:ring-2 focus:ring-primary ${disabled ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-background"}`}
        min={min}
        max={max}
        value={quantity}
        onChange={e => {
          let val = Number(e.target.value);
          if (Number.isNaN(val)) val = min;
          if (!disabled && val >= min && val <= max) onQuantityChange(val);
        }}
        disabled={disabled}
        aria-label="Quantidade"
        style={{ MozAppearance: "textfield" }}
      />
      <Button
        size={size}
        variant={quantity >= max || disabled ? "outline" : "default"}
        type="button"
        onClick={handleIncrease}
        disabled={disabled || quantity >= max}
        className="rounded-full p-2"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SimpleQuantitySelector;
