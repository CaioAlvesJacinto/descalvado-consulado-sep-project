import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { CalendarIcon, MapPinIcon } from "lucide-react";
import QuantityTicketSelector from "./ticket/QuantityTicketSelector";
import { useTicketCart } from "@/contexts/TicketCartContext";
import { createCartTicketItem } from "@/types/cart";

interface EventCardProps {
  id: string;
  title: string;
  description: string;
  start_datetime: string;
  location: string;
  price: number | string;
  image: string;
  available_tickets: number | string;
  sold_tickets: number | string;
  category: string;
}

const EventCard = ({
  id,
  title,
  description,
  start_datetime,
  location,
  price,
  image,
  available_tickets,
  sold_tickets,
  category,
}: EventCardProps) => {
  // Sempre manter valor mínimo 0 e sempre tipo number!
  const ingressosDisponiveis = Math.max(
    Number(available_tickets) - Number(sold_tickets ?? 0),
    0
  );

  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const { addItem } = useTicketCart();

  // Ajusta selectedQuantity caso ingressosDisponiveis seja menor do que o selecionado
  React.useEffect(() => {
    if (selectedQuantity > ingressosDisponiveis) {
      setSelectedQuantity(ingressosDisponiveis > 0 ? 1 : 0);
    }
  }, [ingressosDisponiveis, selectedQuantity]);

  const handleAddToCart = () => {
    if (ingressosDisponiveis === 0 || selectedQuantity < 1) return;
    const item = createCartTicketItem(
      {
        id,
        title,
        description,
        location,
        price: Number(price),
        image,
        available_tickets: Number(available_tickets),
        category,
        start_datetime,
      },
      selectedQuantity
    );
    addItem(item);
  };

  // Debug temporário - pode remover depois!
  console.log({ id, title, available_tickets, sold_tickets, ingressosDisponiveis });

  return (
    <Card className="event-card overflow-hidden rounded-2xl shadow-md border hover:shadow-lg transition">
      <Link to={`/evento/${id}`}>
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>
      </Link>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Link to={`/evento/${id}`} className="flex-1">
            <CardTitle className="text-xl font-bold hover:text-primary transition-colors">{title}</CardTitle>
          </Link>
          <Badge variant="outline" className="bg-accent text-xs ml-2">
            {category}
          </Badge>
        </div>
        <CardDescription className="text-sm line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pb-0">
        <div className="flex items-center gap-2 text-sm">
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          <span>{start_datetime}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <MapPinIcon className="h-4 w-4 text-muted-foreground" />
          <span>{location}</span>
        </div>
        <div className="mt-2">
          <QuantityTicketSelector
            quantity={selectedQuantity}
            onQuantityChange={setSelectedQuantity}
            availableTickets={ingressosDisponiveis}
            showLabel={false}
            size="sm"
            disabled={ingressosDisponiveis === 0}
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 justify-between items-center pt-4 mt-4 border-t">
        <div className="text-sm">
          <span className="font-semibold text-lg">R$ {Number(price).toFixed(2)}</span>
          <div className="text-xs text-muted-foreground">
            {ingressosDisponiveis > 0
              ? `${ingressosDisponiveis} ingresso${ingressosDisponiveis > 1 ? "s" : ""} disponível${ingressosDisponiveis > 1 ? "s" : ""}`
              : "Esgotado"}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/evento/${id}`}>Ver Detalhes</Link>
          </Button>
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={ingressosDisponiveis === 0 || selectedQuantity < 1}
          >
            Adicionar
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
