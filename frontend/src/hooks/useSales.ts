// /hooks/useSales.ts
import { useEffect, useState } from "react";
import {
  getAllSales,
  getFilteredSales,
  getSalesStats,
  getAvailableEvents,
  getAvailableMerchandise,
  getAvailableStatuses,
} from "@/services/salesService";
import { useToast } from "@/hooks/use-toast";
import type {
  Sale,
  SalesFilters,
  SalesStats,
  PaymentStatus,
} from "@/types/sales";

export function useSales() {
  const { toast } = useToast();

  const [sales, setSales] = useState<Sale[]>([]);
  const [filters, setFilters] = useState<SalesFilters>({});
  const [filteredSales, setFilteredSales] = useState<Sale[]>([]);
  const [stats, setStats] = useState<SalesStats>({
    totalRevenue: 0,
    totalSales: 0,
    ticketSales: 0,
    merchandiseSales: 0,
    avgOrderValue: 0,
  });
  const [loading, setLoading] = useState(true);

  const [eventsOptions, setEventsOptions] = useState<{ id: string; name: string }[]>([]);
  const [merchOptions, setMerchOptions] = useState<{ id: string; name: string }[]>([]);
  const statuses = getAvailableStatuses() as PaymentStatus[];

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [salesData, events, merch] = await Promise.all([
          getAllSales(),
          getAvailableEvents(),
          getAvailableMerchandise()
        ]);
        setSales(salesData);
        setEventsOptions(events);
        setMerchOptions(merch);
      } catch {
        toast({ title: "Erro ao carregar vendas", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const applyFilters = async () => {
      setFilteredSales(await getFilteredSales(filters));
      setStats(await getSalesStats(filters));
    };
    applyFilters();
  }, [filters, sales]);

    return {
    sales,
    filteredSales,
    filters,
    setFilters, // 👈 renomear aqui
    salesStats: stats,
    loading,
    eventsOptions,
    merchOptions,
    statuses
    };

}
