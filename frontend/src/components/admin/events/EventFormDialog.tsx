import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUpload } from "@/components/ui/image-upload";
import { Event } from "@/types/event";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Event, "id">) => Promise<void>;
  eventData?: Event;
  loading?: boolean;
};

export default function EventFormDialog({
  isOpen,
  onClose,
  onSubmit,
  eventData,
  loading,
}: Props) {
  const [form, setForm] = useState<Omit<Event, "id">>({
    title: "",
    description: "",
    location: "",
    price: 0,
    start_datetime: "",
    end_datetime: "",
    end_sales_datetime: "",
    status: "ativo",
    category: "",
    available_tickets: 0,
    image: "",
    company_id: undefined,
    created_at: undefined,
    updated_at: undefined,
    featured: false,
    is_published: false,
    // Novos campos:
    organizer: "",
    contact_number: "",
    contact_email: "",
  });

  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (eventData) {
      const { id, image, ...rest } = eventData;
      setForm({
        ...rest,
        image: image || "",
        end_sales_datetime: rest.end_sales_datetime || "",
        organizer: rest.organizer || "",
        contact_number: rest.contact_number || "",
        contact_email: rest.contact_email || "",
      });
      setImages(image ? [image] : []);
    }
  }, [eventData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === "price" || name === "available_tickets" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...form,
      image: images[0] || "",
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-2xl max-h-screen overflow-y-auto sm:px-6 px-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {eventData ? "Editar Evento" : "Novo Evento"}
            </AlertDialogTitle>
          </AlertDialogHeader>

          <div>
            <Label htmlFor="title">Nome do Evento</Label>
            <Input id="title" name="title" value={form.title} onChange={handleChange} required />
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              value={form.description || ""}
              onChange={handleChange}
              rows={3}
              required
            />
          </div>

          {/* CAMPOS NOVOS - Organizador e Contato */}
          <div>
            <Label htmlFor="organizer">Organizador</Label>
            <Input
              id="organizer"
              name="organizer"
              value={form.organizer || ""}
              onChange={handleChange}
              placeholder="Nome do organizador ou empresa"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contact_number">Telefone de Contato</Label>
              <Input
                id="contact_number"
                name="contact_number"
                value={form.contact_number || ""}
                onChange={handleChange}
                placeholder="Ex: (11) 91234-5678"
              />
            </div>
            <div>
              <Label htmlFor="contact_email">E-mail de Contato</Label>
              <Input
                id="contact_email"
                name="contact_email"
                value={form.contact_email || ""}
                onChange={handleChange}
                type="email"
                placeholder="contato@email.com"
              />
            </div>
          </div>
          {/* FIM DOS CAMPOS NOVOS */}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_datetime">Data de Início</Label>
              <Input
                id="start_datetime"
                name="start_datetime"
                type="datetime-local"
                value={form.start_datetime?.slice(0, 16) || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="end_datetime">Data de Término</Label>
              <Input
                id="end_datetime"
                name="end_datetime"
                type="datetime-local"
                value={form.end_datetime?.slice(0, 16) || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="end_sales_datetime">Encerrar Vendas em</Label>
            <Input
              id="end_sales_datetime"
              name="end_sales_datetime"
              type="datetime-local"
              value={form.end_sales_datetime?.slice(0, 16) || ""}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Preço (R$)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="available_tickets">Ingressos Disponíveis</Label>
              <Input
                id="available_tickets"
                name="available_tickets"
                type="number"
                min="1"
                value={form.available_tickets}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location">Local</Label>
            <Input
              id="location"
              name="location"
              value={form.location || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Categoria</Label>
            <Input
              id="category"
              name="category"
              value={form.category || ""}
              onChange={handleChange}
              required
            />
          </div>

          <ImageUpload
            value={images}
            onChange={(imgs) => {
              setImages(imgs);
              setForm((prev) => ({ ...prev, image: imgs[0] || "" }));
            }}
            maxFiles={3}
            label="Imagens do Evento"
          />

          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={form.featured}
              onCheckedChange={(checked) =>
                setForm((prev) => ({ ...prev, featured: !!checked }))
              }
            />
            <Label htmlFor="featured">Evento em destaque</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_published"
              checked={form.is_published}
              onCheckedChange={(checked) =>
                setForm((prev) => ({ ...prev, is_published: !!checked }))
              }
            />
            <Label htmlFor="is_published">Publicado</Label>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel type="button" disabled={loading}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}