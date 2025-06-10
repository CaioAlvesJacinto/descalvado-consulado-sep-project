import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TicketInfo } from "@/types/ticket";
import { Calendar, Shield } from "lucide-react";
import { Button } from "../ui/button";

interface TicketDisplayProps {
  ticket: TicketInfo;
  showActions?: boolean;
  onShare?: () => void;
  onDownload?: () => void;
}

// Função utilitária: checa se é base64 de imagem
function isBase64Image(str?: string) {
  return typeof str === "string" && str.startsWith("data:image");
}

const TicketDisplay: React.FC<TicketDisplayProps> = ({
  ticket,
  showActions = true,
  onShare,
  onDownload,
}) => {
  return (
    <Card className="ticket-card">
      <CardHeader className="text-center border-b pb-4">
        <CardTitle>{ticket.eventName}</CardTitle>
        <div className="text-muted-foreground text-sm flex justify-center items-center gap-1">
          <Calendar className="h-4 w-4" /> {ticket.purchaseDate}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col items-center pt-6">
        <div className="relative">
          {isBase64Image(ticket.qrCodeUrl) ? (
            <img
              src={ticket.qrCodeUrl}
              alt={`QR Code para ${ticket.eventName}`}
              width={180}
              height={180}
              style={{
                border: "1px dashed #d1d5db",
                borderRadius: 8,
                background: "#fff",
              }}
            />
          ) : (
            <div className="w-[180px] h-[180px] flex items-center justify-center bg-muted border border-dashed border-muted-foreground/50 rounded-lg">
              <span className="text-xs text-muted-foreground">QR Code indisponível</span>
            </div>
          )}
          <div className="absolute -bottom-2 -right-2 bg-green-50 p-1 rounded-full border border-green-200">
            <Shield className="h-5 w-5 text-green-600" />
          </div>
        </div>

        <div className="w-full max-w-xs mt-4 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <span className="text-sm font-medium">Nome:</span>
            <span className="text-sm">{ticket.holderName}</span>

            {ticket.quantity && (
              <>
                <span className="text-sm font-medium">Quantidade:</span>
                <span className="text-sm">{ticket.quantity}</span>
              </>
            )}

            {ticket.totalPrice !== undefined && (
              <>
                <span className="text-sm font-medium">Total:</span>
                <span className="text-sm">
                  R$ {ticket.totalPrice.toFixed(2)}
                </span>
              </>
            )}

            <span className="text-sm font-medium">Status:</span>
            <span
              className={`text-sm ${
                ticket.isValidated ? "text-amber-600" : "text-green-600"
              }`}
            >
              {ticket.isValidated ? "Utilizado" : "Não utilizado"}
            </span>

            <span className="text-sm font-medium">ID:</span>
            <span className="text-sm truncate">{ticket.code}</span>
          </div>
        </div>
      </CardContent>

      {showActions && (
        <CardFooter className="flex justify-center gap-2 pt-2">
          {onShare && (
            <Button variant="outline" size="sm" onClick={onShare}>
              Compartilhar
            </Button>
          )}

          {onDownload && (
            <Button size="sm" onClick={onDownload}>
              Download
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default TicketDisplay;
