// 📁 src/components/admin/merchandise/MerchandiseFilters.tsx
import React from "react";

export type MerchandiseFilters = {
  name: string;
  status: string;
  category: string;
};

interface Props {
  filters: MerchandiseFilters;
  onChange: (filters: MerchandiseFilters) => void;
}

export default function MerchandiseFilters({ filters, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <input
        className="border px-2 py-1 rounded"
        placeholder="Nome"
        value={filters.name}
        onChange={(e) => onChange({ ...filters, name: e.target.value })}
      />
      <input
        className="border px-2 py-1 rounded"
        placeholder="Categoria"
        value={filters.category}
        onChange={(e) => onChange({ ...filters, category: e.target.value })}
      />
      <select
        className="border px-2 py-1 rounded"
        value={filters.status}
        onChange={(e) => onChange({ ...filters, status: e.target.value })}
      >
        <option value="">Todos</option>
        <option value="ativo">Ativo</option>
        <option value="inativo">Inativo</option>
      </select>
    </div>
  );
}
