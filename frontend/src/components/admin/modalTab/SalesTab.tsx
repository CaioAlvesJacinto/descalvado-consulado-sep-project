import SalesFilters from "@/components/admin/sales/SalesFilters";
import SalesTable from "@/components/admin/sales/SalesTable";
import ExportButtons from "@/components/admin/sales/ExportButtons";
import {
  Sale,
  SalesFilters as FiltersType,
  PaymentStatus,
} from "@/types/sales";

// ⬇️ Tipos corrigidos aqui:
interface SalesTabProps {
  filteredSales: Sale[];
  salesStats: { totalRevenue: number; totalSales: number };
  salesFilters: FiltersType;
  onFiltersChange: (filters: FiltersType) => void;
  eventsOptions: { id: string; name: string }[];
  merchOptions: { id: string; name: string }[];
  statuses: PaymentStatus[]; // já com tipo correto
}

export default function SalesTab({
  filteredSales,
  salesStats,
  salesFilters,
  onFiltersChange,
  eventsOptions,
  merchOptions,
  statuses,
}: SalesTabProps) {
  return (
    <div className="space-y-4">
      <SalesFilters
        filters={salesFilters}
        onFiltersChange={onFiltersChange}
        events={eventsOptions}
        merchandise={merchOptions}
        statuses={statuses}
      />
      <SalesTable sales={filteredSales} />
      <ExportButtons sales={filteredSales} fileName="vendas_gestor" />
    </div>
  );
}
