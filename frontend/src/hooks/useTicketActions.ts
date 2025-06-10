import { downloadTicketPdf } from "@/utils/ticketPdfUtils";
import { TicketInfo } from "@/types/ticket";
import { useToast } from "@/hooks/use-toast";

export default function useTicketActions() {
  const { toast } = useToast();

  const shareTicket = (ticket: TicketInfo) => {
    if (navigator.share) {
      navigator.share({
        title: `Meu ingresso para ${ticket.eventName}`,
        text: `Veja meu ingresso!`,
        url: window.location.origin + `/meus-ingressos/${ticket.id}`,
      });
    } else {
      toast({
        title: "Compartilhar ingresso",
        description: "Compartilhamento não suportado nesse navegador.",
      });
    }
  };

  const downloadTicket = (ticket: TicketInfo) => {
    downloadTicketPdf(ticket);
    toast({
      title: "Download realizado!",
      description: "Seu ingresso foi baixado em PDF.",
    });
  };

  return { shareTicket, downloadTicket };
}
