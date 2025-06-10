import TicketDisplay from "./TicketDisplay";
import { downloadTicketsPdf } from "@/utils/ticketPdfUtils";
import { TicketInfo } from "@/types/ticket";
import { Button } from "@/components/ui/button";
import useTicketActions from "@/hooks/useTicketActions";

interface TicketGroupProps {
  tickets: TicketInfo[];
  event: any;
}

const TicketGroup: React.FC<TicketGroupProps> = ({ tickets, event }) => {
  const { shareTicket, downloadTicket } = useTicketActions();

  // Agora baixa tudo em um único PDF
  const handleDownloadAll = async () => {
    if (tickets.length === 0) return;
    await downloadTicketsPdf(tickets, event?.title || "evento");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <div className="font-medium">
          {event?.title} ({tickets.length} ingresso{tickets.length > 1 ? "s" : ""})
        </div>
        <Button size="sm" variant="outline" onClick={handleDownloadAll}>
          Baixar todos deste evento
        </Button>
      </div>
      <div className="space-y-2">
        {tickets.map(ticket => (
          <TicketDisplay
            key={ticket.id}
            ticket={ticket}
            onShare={() => shareTicket(ticket)}
            onDownload={() => downloadTicket(ticket)}
          />
        ))}
      </div>
    </div>
  );
};

export default TicketGroup;
