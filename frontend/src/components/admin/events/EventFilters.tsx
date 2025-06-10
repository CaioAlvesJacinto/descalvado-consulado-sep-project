import React from "react";

export type Filters = {
  title: string;
  status: string;
  category: string;
  start_datetime: string;
  end_datetime: string;
};

type Props = {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
};

const statusOptions = [
  { value: "", label: "Todos" },
  { value: "ativo", label: "Ativo" },
  { value: "inativo", label: "Inativo" },
  { value: "encerrado", label: "Encerrado" },
];

export default function EventFilters({ filters, onFiltersChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <input
        className="border rounded px-2 py-1"
        placeholder="Nome do evento"
        value={filters.title}
        onChange={(e) => onFiltersChange({ ...filters, title: e.target.value })}
      />
      <select
        className="border rounded px-2 py-1"
        value={filters.status}
        onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })}
      >
        {statusOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <input
        className="border rounded px-2 py-1"
        placeholder="Categoria"
        value={filters.category}
        onChange={(e) => onFiltersChange({ ...filters, category: e.target.value })}
      />
      <input
        className="border rounded px-2 py-1"
        type="date"
        value={filters.start_datetime}
        onChange={(e) => onFiltersChange({ ...filters, start_datetime: e.target.value })}
        title="Data início"
      />
      <input
        className="border rounded px-2 py-1"
        type="date"
        value={filters.end_datetime}
        onChange={(e) => onFiltersChange({ ...filters, end_datetime: e.target.value })}
        title="Data fim"
      />
    </div>
  );
}
