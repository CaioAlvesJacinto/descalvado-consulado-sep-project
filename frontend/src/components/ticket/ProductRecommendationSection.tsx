
import React from "react";
import EventMerchandiseRecommendation from "@/components/EventMerchandiseRecommendation";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag } from "lucide-react";

interface ProductRecommendationSectionProps {
  eventId: string;
  eventName?: string;
}

const ProductRecommendationSection: React.FC<ProductRecommendationSectionProps> = ({
  eventId,
  eventName
}) => {
  return (
    <div className="my-6">
      <Separator className="my-4" />
      
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <ShoppingBag className="h-4 w-4" />
          <span className="text-sm">Aproveite e leve uma lembrança do evento</span>
        </div>
      </div>
      
      <EventMerchandiseRecommendation 
        eventId={eventId} 
        eventName={eventName}
      />
      
      <Separator className="mt-4" />
    </div>
  );
};

export default ProductRecommendationSection;
