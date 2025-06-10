
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CollaboratorFilters } from "@/types/collaborator";
import { 
  getAvailableDepartments, 
  getAvailableStatuses, 
  getAvailableRoles 
} from "@/services/collaboratorService";
import { X } from "lucide-react";

interface CollaboratorFiltersProps {
  filters: CollaboratorFilters;
  onFiltersChange: (filters: CollaboratorFilters) => void;
}

const CollaboratorFiltersComponent = ({ filters, onFiltersChange }: CollaboratorFiltersProps) => {
  const departments = getAvailableDepartments();
  const statuses = getAvailableStatuses();
  const roles = getAvailableRoles();

  const handleFilterChange = (key: keyof CollaboratorFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value === "all" ? undefined : value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(value => value);

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-wrap gap-4">
        <Input
          placeholder="Buscar por nome ou email..."
          value={filters.search || ""}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="max-w-xs"
        />

        <Select
          value={filters.status || "all"}
          onValueChange={(value) => handleFilterChange("status", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.role || "all"}
          onValueChange={(value) => handleFilterChange("role", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Função" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as funções</SelectItem>
            {roles.map((role) => (
              <SelectItem key={role} value={role}>
                {role === 'gerente' ? 'Gerente' : 'Colaborador'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.department || "all"}
          onValueChange={(value) => handleFilterChange("department", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Departamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os departamentos</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
            <X className="h-4 w-4" />
            Limpar Filtros
          </Button>
        )}
      </div>

      <div className="flex gap-4">
        <Input
          type="date"
          placeholder="Data inicial"
          value={filters.dateFrom || ""}
          onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
          className="max-w-xs"
        />
        <Input
          type="date"
          placeholder="Data final"
          value={filters.dateTo || ""}
          onChange={(e) => handleFilterChange("dateTo", e.target.value)}
          className="max-w-xs"
        />
      </div>
    </div>
  );
};

export default CollaboratorFiltersComponent;
