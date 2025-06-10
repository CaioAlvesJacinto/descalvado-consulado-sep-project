// src/components/admin/sales/SalesFilters.tsx
import React from "react";
import type { SalesFilters, PaymentStatus } from "@/types/sales";  /* ← type-only */
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarDays, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface Option {
  id: string;
  name: string;
}

interface Props {
  filters: SalesFilters;
  onFiltersChange: (f: SalesFilters) => void;
  events: Option[];
  merchandise: Option[];
  statuses: PaymentStatus[];          // tipo mais preciso
}

export default function SalesFilters({
  filters,
  onFiltersChange,
  events,
  merchandise,
  statuses,
}: Props) {
  /* helpers ------------------------------------------------------- */
  const update = (patch: Partial<SalesFilters>) =>
    onFiltersChange({ ...filters, ...patch });

  const clearAll = () =>
    onFiltersChange({
      dateFrom: "",
      dateTo: "",
      eventId: "",
      merchandiseId: "",
      status: "",
      type: "",
    });

  /* UI ------------------------------------------------------------ */
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end mb-6">
      {/* ... (calendários, tipo, evento, produto iguais) ... */}

      {/* Status */}
      <Select
        value={filters.status ?? ""}
        onValueChange={(v) =>
          update({
            status: v === "all" ? "" : (v as PaymentStatus),  // ← cast seguro
          })
        }
      >
        <SelectTrigger className="w-full md:w-[150px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          {statuses.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Limpar */}
      <Button
        variant="ghost"
        onClick={clearAll}
        className="text-muted-foreground"
      >
        <X className="mr-2 h-4 w-4" />
        Limpar
      </Button>
    </div>
  );
}
