
import React from "react";
import MultipleTicketsDisplay from "./MultipleTicketsDisplay";
import EventMerchandiseRecommendation from "@/components/EventMerchandiseRecommendation";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { TicketPurchase } from "@/types/ticket";
import { Shield } from "lucide-react";

interface TicketGeneratedStepProps {
  purchase: TicketPurchase;
  eventId: string;
  onShareAll: () => void;
  onDownloadAll: () => void;
  onShareTicket: (ticketId: string) => void;
  onDownloadTicket: (ticketId: string) => void;
}

const TicketGeneratedStep = ({
  purchase,
  eventId,
  onShareAll,
  onDownloadAll,
  onShareTicket,
  onDownloadTicket,
}: TicketGeneratedStepProps) => {
  const isMultipleTickets = purchase.tickets.length > 1;
  
  return (
    <>
      <CardHeader>
        <CardTitle className="text-center text-green-600">
          {isMultipleTickets ? 'Ingressos Gerados com Sucesso!' : 'Ingresso Gerado com Sucesso!'}
        </CardTitle>
        <CardDescription className="text-center flex items-center justify-center gap-1">
          <Shield className="h-4 w-4" /> 
          {isMultipleTickets ? 'Seus ingressos foram enviados para o seu e-mail' : 'Seu ingresso foi enviado para o seu e-mail'}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="bg-green-50 px-3 py-2 rounded-md mb-4 text-sm text-green-700 flex items-center gap-1">
          <Shield className="h-4 w-4" /> 
          {isMultipleTickets ? 'Estes ingressos possuem criptografia e proteção contra falsificação' : 'Este ingresso possui criptografia e proteção contra falsificação'}
        </div>
        
        <MultipleTicketsDisplay 
          purchase={purchase}
          onShareAll={onShareAll}
          onDownloadAll={onDownloadAll}
          onShareTicket={onShareTicket}
          onDownloadTicket={onDownloadTicket}
        />
        
        {/* Additional merchandise recommendations (if user wants to buy more) */}
        <div className="mt-8 w-full">
          <h3 className="text-lg font-semibold mb-4 text-center">Quer levar mais lembranças?</h3>
          <EventMerchandiseRecommendation eventId={eventId} />
        </div>
      </CardContent>
    </>
  );
};

export default TicketGeneratedStep;
