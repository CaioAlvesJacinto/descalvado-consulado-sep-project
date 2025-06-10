
import { Link } from "react-router-dom";
import { Merchandise } from "@/types/merchandise";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Calendar } from "lucide-react";

interface MerchandiseCardProps {
  merchandise: Merchandise;
  eventName?: string; // Optional event name for display
}

const MerchandiseCard = ({ merchandise, eventName }: MerchandiseCardProps) => {
  const {
    id,
    name,
    price,
    images,
    category,
    eventRelated,
    inStock,
    featured,
  } = merchandise;

  return (
    <Card className="overflow-hidden flex flex-col h-full transition-all duration-200 hover:shadow-lg">
      {featured && (
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-primary text-primary-foreground">
            Destaque
          </Badge>
        </div>
      )}
      <Link to={`/loja/${id}`}>
        <div className="aspect-square w-full overflow-hidden">
          <img
            src={images[0]}
            alt={name}
            className="w-full h-full object-cover object-center transition-transform hover:scale-105"
          />
        </div>
      </Link>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-base line-clamp-1">{name}</h3>
            <p className="text-lg font-bold text-primary">R$ {price.toFixed(2)}</p>
          </div>
          {category && (
            <Badge variant="outline" className="ml-2">
              {category}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 pb-2 flex-grow">
        {eventRelated && (eventName || eventRelated) && (
          <div className="flex items-center text-xs text-muted-foreground mt-2">
            <Calendar className="h-3 w-3 mr-1" />
            <span>
              {eventName || `Evento ID: ${eventRelated}`}
            </span>
          </div>
        )}
        {!inStock && (
          <Badge variant="destructive" className="mt-2">
            Esgotado
          </Badge>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link to={`/loja/${id}`}>
            <ShoppingBag className="mr-2 h-4 w-4" />
            Ver detalhes
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MerchandiseCard;
