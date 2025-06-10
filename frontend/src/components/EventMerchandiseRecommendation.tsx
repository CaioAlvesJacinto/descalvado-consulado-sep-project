
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { getMerchandiseByEvent } from "@/services/merchandiseService";
import { Merchandise } from "@/types/merchandise";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ShoppingBag, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface EventMerchandiseRecommendationProps {
  eventId: string;
  eventName?: string;
}

const EventMerchandiseRecommendation = ({ eventId, eventName }: EventMerchandiseRecommendationProps) => {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>({});
  
  // Get merchandise related to the event
  const eventMerchandise = getMerchandiseByEvent(eventId);
  
  if (eventMerchandise.length === 0) {
    return null; // Don't render anything if no related merchandise
  }
  
  const handleAddToCart = (merchandise: Merchandise) => {
    const size = selectedSizes[merchandise.id] || merchandise.sizes.find(s => s.available)?.value || "";
    const color = selectedColors[merchandise.id] || merchandise.colors.find(c => c.available)?.value || "";
    
    if (!size || !color) {
      toast({
        title: "Não foi possível adicionar ao carrinho",
        description: "Por favor, selecione um tamanho e uma cor",
        variant: "destructive",
      });
      return;
    }
    
    // Add to cart
    addItem({
      merchandiseId: merchandise.id,
      name: merchandise.name,
      size,
      color,
      quantity: 1,
      price: merchandise.price,
      image: merchandise.images[0],
    });

    toast({
      title: "Produto adicionado ao carrinho",
      description: `${merchandise.name} foi adicionado ao seu carrinho.`,
    });
  };
  
  const handleSizeSelect = (merchandiseId: string, size: string) => {
    setSelectedSizes({ ...selectedSizes, [merchandiseId]: size });
  };
  
  const handleColorSelect = (merchandiseId: string, color: string) => {
    setSelectedColors({ ...selectedColors, [merchandiseId]: color });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h3 className="text-xl font-bold flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          Camisetas relacionadas ao evento
          {eventName && <span className="ml-2 text-muted-foreground">({eventName})</span>}
        </h3>
        <Link to="/loja" className="text-primary hover:underline text-sm mt-2 md:mt-0">
          Ver todos os produtos
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {eventMerchandise.map((merchandise) => (
          <Card key={merchandise.id} className="overflow-hidden animate-fade-in">
            {merchandise.featured && (
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="bg-primary text-primary-foreground">
                  Destaque
                </Badge>
              </div>
            )}
            <Link to={`/loja/${merchandise.id}`}>
              <div className="aspect-square w-full overflow-hidden">
                <img 
                  src={merchandise.images[0]} 
                  alt={merchandise.name} 
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
            </Link>
            <CardContent className="p-4">
              <Link to={`/loja/${merchandise.id}`}>
                <h4 className="font-semibold hover:text-primary transition-colors">{merchandise.name}</h4>
              </Link>
              <p className="text-muted-foreground text-sm line-clamp-2 mt-1">{merchandise.description.substring(0, 70)}...</p>
              <p className="mt-2 font-bold">R$ {merchandise.price.toFixed(2)}</p>
              
              <div className="mt-3">
                <p className="text-sm font-medium mb-1">Tamanho:</p>
                <div className="flex flex-wrap gap-2">
                  {merchandise.sizes
                    .filter(size => size.available)
                    .map(size => (
                      <Button
                        key={size.value}
                        variant={selectedSizes[merchandise.id] === size.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleSizeSelect(merchandise.id, size.value)}
                        className="w-10 h-10 p-0"
                      >
                        {size.label}
                      </Button>
                    ))
                  }
                </div>
              </div>
              
              <div className="mt-3">
                <p className="text-sm font-medium mb-1">Cor:</p>
                <div className="flex flex-wrap gap-2">
                  {merchandise.colors
                    .filter(color => color.available)
                    .map(color => (
                      <Button
                        key={color.value}
                        variant={selectedColors[merchandise.id] === color.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleColorSelect(merchandise.id, color.value)}
                        className="w-10 h-10 p-0"
                        style={{ backgroundColor: selectedColors[merchandise.id] === color.value ? color.hex : 'transparent' }}
                      >
                        {selectedColors[merchandise.id] !== color.value && (
                          <span className="w-4 h-4 rounded-full" style={{ backgroundColor: color.hex }}></span>
                        )}
                      </Button>
                    ))
                  }
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button 
                onClick={() => handleAddToCart(merchandise)}
                className="w-full transition-all duration-200 hover:scale-105"
                disabled={!merchandise.inStock}
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                {merchandise.inStock ? "Adicionar ao carrinho" : "Produto esgotado"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EventMerchandiseRecommendation;
