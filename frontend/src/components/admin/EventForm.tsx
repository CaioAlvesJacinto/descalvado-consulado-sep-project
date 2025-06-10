
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUpload } from "@/components/ui/image-upload";
import { Event } from "@/types/event";

interface EventFormProps {
  event?: Event;
  onSubmit: (eventData: Omit<Event, 'id'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const EventForm = ({ event, onSubmit, onCancel, isLoading = false }: EventFormProps) => {
  const [formData, setFormData] = useState({
    title: event?.title || "",
    description: event?.description || "",
    date: event?.date || "",
    location: event?.location || "",
    price: event?.price || 0,
    image: event?.image || "",
    images: event?.image ? [event.image] : [],
    availableTickets: event?.availableTickets || 0,
    category: event?.category || "",
    featured: event?.featured || false,
    organizer: event?.organizer || "",
    contactEmail: event?.contactEmail || ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Use the first image as the main image for backward compatibility
    const submitData = {
      ...formData,
      image: formData.images[0] || formData.image
    };
    onSubmit(submitData);
  };

  const handleInputChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = field === 'price' || field === 'availableTickets' 
      ? parseFloat(e.target.value) || 0
      : e.target.value;
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFeaturedChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      featured: checked
    }));
  };

  const handleImagesChange = (images: string[]) => {
    setFormData(prev => ({
      ...prev,
      images,
      image: images[0] || "" // Keep backward compatibility
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Nome do Evento</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={handleInputChange('title')}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={handleInputChange('description')}
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">Data</Label>
          <Input
            id="date"
            value={formData.date}
            onChange={handleInputChange('date')}
            placeholder="DD/MM/AAAA"
            required
          />
        </div>

        <div>
          <Label htmlFor="category">Categoria</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={handleInputChange('category')}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="location">Local</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={handleInputChange('location')}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Preço (R$)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={handleInputChange('price')}
            required
          />
        </div>

        <div>
          <Label htmlFor="availableTickets">Ingressos Disponíveis</Label>
          <Input
            id="availableTickets"
            type="number"
            min="1"
            value={formData.availableTickets}
            onChange={handleInputChange('availableTickets')}
            required
          />
        </div>
      </div>

      <ImageUpload
        value={formData.images}
        onChange={handleImagesChange}
        maxFiles={3}
        label="Imagens do Evento"
      />

      <div>
        <Label htmlFor="organizer">Organizador</Label>
        <Input
          id="organizer"
          value={formData.organizer}
          onChange={handleInputChange('organizer')}
        />
      </div>

      <div>
        <Label htmlFor="contactEmail">Email de Contato</Label>
        <Input
          id="contactEmail"
          type="email"
          value={formData.contactEmail}
          onChange={handleInputChange('contactEmail')}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="featured"
          checked={formData.featured}
          onCheckedChange={handleFeaturedChange}
        />
        <Label htmlFor="featured">Evento em destaque</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );
};

export default EventForm;
