import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Merchandise } from "@/types/merchandise";

interface OverviewTabProps {
  salesStats: {
    totalRevenue: number;
    totalSales: number;
  };
  eventCount: number;
  merchandise: Merchandise[];
}

export default function OverviewTab({ salesStats, eventCount, merchandise }: OverviewTabProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Total Arrecadado</CardDescription>
          <CardTitle className="text-3xl">R$ {salesStats.totalRevenue.toFixed(2)}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Total de Vendas</CardDescription>
          <CardTitle className="text-3xl">{salesStats.totalSales}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Eventos Ativos</CardDescription>
          <CardTitle className="text-3xl">{eventCount}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Produtos em Estoque</CardDescription>
          <CardTitle className="text-3xl">
            {merchandise.filter((p) => p.stock > 0).length}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
