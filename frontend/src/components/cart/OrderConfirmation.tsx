
import QRCodeDisplay from "@/components/QRCodeDisplay";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, ShoppingBag, Ticket } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface OrderConfirmationProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  ticketData: string;
}

const OrderConfirmation = ({
  isOpen,
  onOpenChange,
  ticketData,
}: OrderConfirmationProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="animate-fade-in text-center">Pedido concluído!</DialogTitle>
          <DialogDescription className="animate-fade-in text-center" style={{ animationDelay: "100ms" }}>
            Seu pedido foi realizado com sucesso. Apresente o QR Code abaixo ao retirar suas camisetas no evento.
          </DialogDescription>
        </DialogHeader>
        
        <Separator className="animate-fade-in" style={{ animationDelay: "200ms" }} />
        
        <div className="flex items-center justify-center py-6 animate-scale-in" style={{ animationDelay: "200ms" }}>
          {ticketData && <QRCodeDisplay value={ticketData} size={200} />}
        </div>
        
        <div className="bg-muted/30 rounded-lg p-4 mx-auto max-w-sm text-center mb-4 animate-fade-in" style={{ animationDelay: "300ms" }}>
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600 mb-2 animate-scale-in" style={{ animationDelay: "400ms" }}>
            <Check className="h-5 w-5" />
          </div>
          <p className="font-medium">Compra finalizada com sucesso!</p>
          <p className="text-muted-foreground text-sm mt-1">
            Você receberá um e-mail com os detalhes do seu pedido.
          </p>
        </div>
        
        <div className="flex justify-center gap-4 animate-fade-in" style={{ animationDelay: "500ms" }}>
          <Button asChild variant="outline" className="flex items-center transition-all duration-200 hover:scale-105">
            <Link to="/perfil">
              <Ticket className="mr-2 h-4 w-4" />
              Meus Ingressos
            </Link>
          </Button>
          <Button asChild className="flex items-center transition-all duration-200 hover:scale-105">
            <Link to="/loja">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Continuar Comprando
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderConfirmation;
