import { Button } from "@/components/ui/button";
import EventsTable from "@/components/admin/events/EventsTable";
import { Event } from "@/types/event";

interface EventsTabProps {
  events: Event[];
  onCreateEvent: () => void;
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (event: Event) => void;
}

export default function EventsTab({ events, onCreateEvent, onEditEvent, onDeleteEvent }: EventsTabProps) {
  return (
    <div className="space-y-4">
      <EventsTable
        events={events}
        onEdit={onEditEvent}
        onDelete={onDeleteEvent}
      />
      <Button onClick={onCreateEvent}>Novo Evento</Button>
    </div>
  );
}
