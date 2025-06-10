import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface UpcomingEventsListProps {
  events: any[];
}

const UpcomingEventsList: React.FC<UpcomingEventsListProps> = ({ events }) => {
  if (!events.length) {
    return (
      <div className="text-center text-muted-foreground py-8">
        Nenhum evento disponível no momento.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <Card key={event.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{event.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(event.start_datetime).toLocaleString("pt-BR", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
                <p className="text-sm text-muted-foreground">{event.location}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">R$ {Number(event.price).toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">
                  {event.available_tickets} ingressos disponíveis
                </p>
              </div>
            </div>
            <div className="mt-4 text-right">
              <Button variant="outline" size="sm" asChild> 
                <Link to={`/evento/${event.id}`}> 
                  Saiba Mais <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UpcomingEventsList;
