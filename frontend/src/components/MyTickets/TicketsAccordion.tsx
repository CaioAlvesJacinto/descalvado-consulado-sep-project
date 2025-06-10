import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import TicketGroup from "./TicketGroup";
import { groupTicketsByEvent } from "@/utils/ticketGroupUtils";
import { TicketInfo } from "@/types/ticket";

interface TicketsAccordionProps {
  tickets: TicketInfo[];
  events: any[];
}

const TicketsAccordion: React.FC<TicketsAccordionProps> = ({ tickets, events }) => {
  const ticketsPorEvento = groupTicketsByEvent(tickets);

  return (
    <Accordion type="multiple" className="space-y-2">
      {Object.entries(ticketsPorEvento).map(([eventId, ticketsEvento]) => {
        const evento = events.find(e => e.id === eventId);
        return (
          <AccordionItem key={eventId} value={eventId}>
            <AccordionTrigger>
              <span>{evento?.title || "Evento"} ({ticketsEvento.length} ingresso{ticketsEvento.length > 1 ? "s" : ""})</span>
            </AccordionTrigger>
            <AccordionContent>
              <TicketGroup tickets={ticketsEvento} event={evento} />
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

export default TicketsAccordion;
