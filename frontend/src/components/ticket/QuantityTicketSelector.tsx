import { Label } from "@/components/ui/label";
import SimpleQuantitySelector from "./SimpleQuantitySelector";

interface QuantityTicketSelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  maxQuantity?: number;
  availableTickets: number;
  showLabel?: boolean;
  size?: "sm" | "default";
  disabled?: boolean;      // <-- Adiciona disabled
  min?: number;            // <-- Adiciona min (opcional)
}

const QuantityTicketSelector = ({
  quantity,
  onQuantityChange,
  maxQuantity = 10,
  availableTickets,
  showLabel = true,
  size = "default",
  disabled = false,
  min = 1,
}: QuantityTicketSelectorProps) => {
  return (
    <div className="space-y-2">
      {showLabel && (
        <Label htmlFor="ticket-quantity">Quantidade de Ingressos</Label>
      )}
      <SimpleQuantitySelector
        quantity={quantity}
        onQuantityChange={onQuantityChange}
        maxQuantity={maxQuantity}
        availableTickets={availableTickets}
        size={size}
        disabled={disabled}
        min={min}
      />
    </div>
  );
};

export default QuantityTicketSelector;
