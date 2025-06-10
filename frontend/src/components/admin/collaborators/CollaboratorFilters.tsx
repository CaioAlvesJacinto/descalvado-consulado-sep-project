import React from "react";
import type {
  CollaboratorFilters,
  CollaboratorRole,
  CollaboratorStatus,
} from "@/types/collaborator";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CalendarDays, X } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  getAvailableRoles,
  getAvailableStatuses,
  roleLabel,
} from "@/services/collaboratorService";

interface Props {
  filters: CollaboratorFilters;
  onFiltersChange: (f: CollaboratorFilters) => void;
  departments?: string[];
}

export default function CollaboratorFilters({
  filters,
  onFiltersChange,
  departments = [],
}: Props) {
  const update = (patch: Partial<CollaboratorFilters>) =>
    onFiltersChange({ ...filters, ...patch });

  const clearAll = () =>
    onFiltersChange({
      search: "",
      role: "",
      status: "",
      department: "",
      dateFrom: "",
      dateTo: "",
    });

  const availableRoles = getAvailableRoles();
  const availableStatuses = getAvailableStatuses();

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end mb-6">
      {/* Busca por nome ou e-mail */}
      <Input
        placeholder="Buscar por nome ou e-mail"
        value={filters.search ?? ""}
        onChange={(e) => update({ search: e.target.value })}
        className="w-full md:w-[220px]"
      />

      {/* Função */}
      <Select
        value={filters.role || "todas"}
        onValueChange={(v) => update({ role: v === "todas" ? "" : (v as CollaboratorRole) })}
      >
        <SelectTrigger className="w-full md:w-[160px]">
          <SelectValue placeholder="Função" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todas">Todas</SelectItem>
          {availableRoles.map((role) => (
            <SelectItem key={role} value={role}>
              {roleLabel[role]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Status */}
      <Select
        value={filters.status || "todos"}
        onValueChange={(v) => update({ status: v === "todos" ? "" : (v as CollaboratorStatus) })}
      >
        <SelectTrigger className="w-full md:w-[160px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos</SelectItem>
          {availableStatuses.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Departamento */}
      <Select
        value={filters.department || "todos"}
        onValueChange={(v) => update({ department: v === "todos" ? "" : v })}
      >
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Departamento" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos</SelectItem>
          {departments.map((d) => (
            <SelectItem key={d} value={d}>
              {d}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Data início */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full md:w-[135px] justify-start">
            <CalendarDays className="mr-2 h-4 w-4" />
            {filters.dateFrom ? filters.dateFrom : "Data início"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <Calendar
            mode="single"
            selected={filters.dateFrom ? new Date(filters.dateFrom) : undefined}
            onSelect={(d) =>
              update({ dateFrom: d?.toISOString().split("T")[0] })
            }
          />
        </PopoverContent>
      </Popover>

      {/* Data fim */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full md:w-[135px] justify-start">
            <CalendarDays className="mr-2 h-4 w-4" />
            {filters.dateTo ? filters.dateTo : "Data fim"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <Calendar
            mode="single"
            selected={filters.dateTo ? new Date(filters.dateTo) : undefined}
            onSelect={(d) =>
              update({ dateTo: d?.toISOString().split("T")[0] })
            }
          />
        </PopoverContent>
      </Popover>

      {/* Limpar filtros */}
      <Button variant="ghost" onClick={clearAll} className="text-muted-foreground">
        <X className="mr-2 h-4 w-4" />
        Limpar
      </Button>
    </div>
  );
}
