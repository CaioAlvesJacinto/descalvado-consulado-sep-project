
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Merchandise } from "@/types/merchandise";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllMerchandise, getMerchandiseCategories } from "@/services/merchandiseService";

interface MerchandiseFormProps {
  initialData?: Partial<Merchandise>;
  onSubmit: (data: z.infer<typeof merchandiseFormSchema>) => void;
  events?: { id: string; name: string }[];
}

const merchandiseFormSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  price: z.coerce.number().positive("Preço deve ser positivo"),
  stock: z.coerce.number().min(0, "Estoque deve ser zero ou positivo"),
  category: z.string().min(1, "Categoria é obrigatória"),
  inStock: z.boolean().default(true),
  featured: z.boolean().default(false),
  eventRelated: z.string().optional(),
  images: z.array(z.string()).min(1, "Pelo menos uma imagem é necessária"),
  sizes: z.array(
    z.object({
      value: z.string(),
      label: z.string(),
      available: z.boolean(),
    })
  ),
  colors: z.array(
    z.object({
      value: z.string(),
      label: z.string(),
      hex: z.string(),
      available: z.boolean(),
    })
  ),
});

const defaultSizes = [
  { value: "P", label: "P", available: true },
  { value: "M", label: "M", available: true },
  { value: "G", label: "G", available: true },
  { value: "GG", label: "GG", available: true },
];

const defaultColors = [
  { value: "verde", label: "Verde", hex: "#006437", available: true },
  { value: "branco", label: "Branco", hex: "#FFFFFF", available: true },
  { value: "preto", label: "Preto", hex: "#000000", available: true },
  { value: "vermelho", label: "Vermelho", hex: "#FF0000", available: true },
  { value: "azul", label: "Azul", hex: "#1c4c96", available: true },
];

const MerchandiseForm = ({ initialData, onSubmit, events }: MerchandiseFormProps) => {
  const categories = getMerchandiseCategories();
  
  const form = useForm<z.infer<typeof merchandiseFormSchema>>({
    resolver: zodResolver(merchandiseFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      price: initialData?.price || 0,
      stock: initialData?.stock || 0,
      category: initialData?.category || "",
      inStock: initialData?.inStock !== undefined ? initialData.inStock : true,
      featured: initialData?.featured || false,
      eventRelated: initialData?.eventRelated || undefined,
      images: initialData?.images || [""],
      sizes: initialData?.sizes || defaultSizes,
      colors: initialData?.colors || defaultColors,
    },
  });

  const handleSubmit = (data: z.infer<typeof merchandiseFormSchema>) => {
    // Auto-set inStock based on stock quantity
    data.inStock = data.stock > 0;
    onSubmit(data);
  };

  const watchStock = form.watch("stock");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome do produto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea placeholder="Descrição detalhada do produto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço (R$)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estoque</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormDescription>
                  {watchStock === 0 && "⚠️ Produto ficará indisponível"}
                  {watchStock > 0 && watchStock <= 10 && "⚠️ Estoque baixo"}
                  {watchStock > 10 && "✅ Estoque adequado"}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                    <SelectItem value="Nova">Nova Categoria</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Destaque</FormLabel>
                  <FormDescription>
                    Marque para exibir este produto em destaque
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        {events && events.length > 0 && (
          <FormField
            control={form.control}
            name="eventRelated"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Evento Relacionado</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um evento relacionado (opcional)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">Nenhum evento</SelectItem>
                    {events.map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Associe este produto a um evento específico (opcional)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL da Imagem</FormLabel>
              <FormControl>
                <Input placeholder="URL da imagem do produto" value={field.value[0] || ""} 
                  onChange={(e) => field.onChange([e.target.value])} />
              </FormControl>
              <FormDescription>
                Insira a URL da imagem principal do produto
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="submit">
            {initialData?.id ? "Atualizar Produto" : "Criar Produto"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MerchandiseForm;
