
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Event } from "@/types/event";
import EventForm from "./EventForm";

interface EventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (eventData: Omit<Event, 'id'>) => void;
  event?: Event;
  isLoading?: boolean;
}

const EventDialog = ({ isOpen, onClose, onSubmit, event, isLoading = false }: EventDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {event ? "Editar Evento" : "Novo Evento"}
          </DialogTitle>
          <DialogDescription>
            {event 
              ? "Edite as informações do evento abaixo."
              : "Preencha as informações para criar um novo evento."
            }
          </DialogDescription>
        </DialogHeader>
        <EventForm
          event={event}
          onSubmit={onSubmit}
          onCancel={onClose}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EventDialog;
