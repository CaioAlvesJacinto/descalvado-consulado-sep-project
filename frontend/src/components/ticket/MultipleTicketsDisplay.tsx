
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TicketDisplay from "@/components/MyTickets/TicketDisplay";
import { TicketPurchase } from "@/types/ticket";
import { Download, Share2 } from "lucide-react";

interface MultipleTicketsDisplayProps {
  purchase: TicketPurchase;
  onShareAll?: () => void;
  onDownloadAll?: () => void;
  onShareTicket?: (ticketId: string) => void;
  onDownloadTicket?: (ticketId: string) => void;
}

const MultipleTicketsDisplay: React.FC<MultipleTicketsDisplayProps> = ({
  purchase,
  onShareAll,
  onDownloadAll,
  onShareTicket,
  onDownloadTicket
}) => {
  return (
    <div className="space-y-6">
      {/* Purchase Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-green-600">
            {purchase.tickets.length === 1 ? 'Ingresso Gerado' : `${purchase.tickets.length} Ingressos Gerados`}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="bg-green-50 px-4 py-3 rounded-lg">
            <p className="text-sm text-green-700">
              <strong>Evento:</strong> {purchase.eventName}
            </p>
            <p className="text-sm text-green-700">
              <strong>Titular:</strong> {purchase.holderName}
            </p>
            <p className="text-sm text-green-700">
              <strong>Total:</strong> R$ {purchase.totalPrice.toFixed(2)} ({purchase.totalQuantity} {purchase.totalQuantity === 1 ? 'ingresso' : 'ingressos'})
            </p>
          </div>
          
          {purchase.tickets.length > 1 && (
            <div className="flex gap-2 justify-center">
              {onShareAll && (
                <Button variant="outline" size="sm" onClick={onShareAll}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Compartilhar Todos
                </Button>
              )}
              {onDownloadAll && (
                <Button size="sm" onClick={onDownloadAll}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Todos
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Individual Tickets */}
      <div className="space-y-4">
        {purchase.tickets.map((ticket, index) => (
          <div key={ticket.id}>
            {purchase.tickets.length > 1 && (
              <h3 className="text-lg font-semibold mb-2 text-center">
                Ingresso {ticket.ticketNumber} de {purchase.totalQuantity}
              </h3>
            )}
            <TicketDisplay
              ticket={ticket}
              showActions={true}
              onShare={() => onShareTicket?.(ticket.id)}
              onDownload={() => onDownloadTicket?.(ticket.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultipleTicketsDisplay;
