import React, { useState, useEffect } from "react";
import { Merchandise } from "@/types/merchandise";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";   // ← caminho/nomes certos

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: Omit<Merchandise, "id" | "created_at" | "updated_at">,
    id?: string
  ) => void;
  initialData?: Merchandise;
  loading: boolean;
}

// ✅ tipagem completa (todos obrigatórios) ─ evita erro 2345
type FormState = {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  status: "ativo" | "inativo";
};

export default function MerchandiseForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading,
}: Props) {
  // valores-padrão
  const [form, setForm] = useState<FormState>({
    name: "",
    description: "",
    price: 0,
    image: "",
    category: "",
    stock: 0,
    status: "ativo",
  });

  // preenche quando abre para edição
  useEffect(() => {
    if (initialData) {
      const { id, created_at, updated_at, ...rest } = initialData;
      setForm({
        name: rest.name,
        description: rest.description ?? "",
        price: rest.price ?? 0,
        image: rest.image ?? "",
        category: rest.category ?? "",
        stock: rest.stock ?? 0,
        status: rest.status ?? "ativo",
      });
    } else {
      // reset
      setForm({
        name: "",
        description: "",
        price: 0,
        image: "",
        category: "",
        stock: 0,
        status: "ativo",
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "stock" ? Number(value) : (value as never),
    }));
  };

  const handleSubmit = () => {
    onSubmit(form, initialData?.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar Produto" : "Novo Produto"}
          </DialogTitle>
        </DialogHeader>

        {/* campos */}
        <div className="space-y-2 mt-4">
          <input
            name="name"
            placeholder="Nome"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded"
          />
          <input
            name="description"
            placeholder="Descrição"
            value={form.description}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded"
          />
          <input
            name="price"
            type="number"
            placeholder="Preço"
            value={form.price}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded"
          />
          <input
            name="stock"
            type="number"
            placeholder="Estoque"
            value={form.stock}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded"
          />
          <input
            name="category"
            placeholder="Categoria"
            value={form.category}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded"
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded"
          >
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>

        {/* botões */}
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {initialData ? "Atualizar" : "Criar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
