
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";

interface EventSelectionCardProps {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  availableTickets: number;
  category: string;
  onSelect: (eventId: string, eventTitle: string) => void;
}

const EventSelectionCard = ({ 
  id, 
  title, 
  description, 
  date, 
  location, 
  availableTickets, 
  category,
  onSelect 
}: EventSelectionCardProps) => {
  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline">{category}</Badge>
          <Badge variant={availableTickets > 50 ? "default" : "secondary"}>
            <Users className="h-3 w-3 mr-1" />
            {availableTickets} ingressos
          </Badge>
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>
          <Button 
            onClick={() => onSelect(id, title)} 
            className="w-full mt-4"
          >
            Validar Ingressos deste Evento
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventSelectionCard;
