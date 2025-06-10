// src/services/salesService.ts
import { supabase } from "@/integrations/supabase/supabaseClient";
import {
  Sale,
  SalesFilters,
  SalesStats,
  TicketSale,
  MerchandiseSale,
} from "@/types/sales";
import { getAllEvents } from "@/services/eventService";
import { getAllMerchandise } from "@/services/merchandiseService";

/* ------------------------------------------------------------------ */
/* CRUD principal                                                     */
/* ------------------------------------------------------------------ */
export async function getAllSales(): Promise<Sale[]> {
  const { data, error } = await supabase
    .from("sales")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Sale[];
}

export async function createSale(
  payload: Omit<Sale, "id" | "created_at">
): Promise<Sale> {
  const { data, error } = await supabase
    .from("sales")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data as Sale;
}

export async function updateSale(
  id: string,
  payload: Partial<Sale>
): Promise<Sale> {
  const { data, error } = await supabase
    .from("sales")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Sale;
}

export async function deleteSale(id: string): Promise<boolean> {
  const { error } = await supabase.from("sales").delete().eq("id", id);
  if (error) throw error;
  return true;
}

/* ------------------------------------------------------------------ */
/* Helpers usados no dashboard                                        */
/* ------------------------------------------------------------------ */
export async function getFilteredSales(
  filters: SalesFilters
): Promise<Sale[]> {
  const list = await getAllSales();

  return list.filter((sale) => {
    if (filters.dateFrom && sale.date < filters.dateFrom) return false;
    if (filters.dateTo && sale.date > filters.dateTo) return false;
    if (filters.type && sale.type !== filters.type) return false;
    if (filters.status && sale.status !== filters.status) return false;

    if (filters.eventId && sale.type === "Ingresso") {
      const t = sale as TicketSale;
      if (t.eventId !== filters.eventId) return false;
    }

    if (filters.merchandiseId && sale.type === "Produto") {
      const m = sale as MerchandiseSale;
      if (m.merchandiseId !== filters.merchandiseId) return false;
    }

    return true;
  });
}

export async function getSalesStats(
  filters: SalesFilters = {}
): Promise<SalesStats> {
  const sales = await getFilteredSales(filters);
  const paid = sales.filter((s) => s.status === "Pago");

  const totalRevenue = paid.reduce((sum, s) => sum + s.amount, 0);
  const ticketSales = sales.filter((s) => s.type === "Ingresso").length;
  const merchandiseSales = sales.filter((s) => s.type === "Produto").length;

  return {
    totalRevenue,
    totalSales: sales.length,
    ticketSales,
    merchandiseSales,
    avgOrderValue: paid.length ? totalRevenue / paid.length : 0,
  };
}

/* ------------------------------------------------------------------ */
/* Listas para filtros / selects                                      */
/* ------------------------------------------------------------------ */
export async function getAvailableEvents() {
  const events = await getAllEvents();
  return events.map((e) => ({ id: e.id, name: e.title }));
}

export async function getAvailableMerchandise() {
  const items = await getAllMerchandise();
  return items.map((m) => ({ id: m.id, name: m.name }));
}

export function getAvailableStatuses() {
  return ["Pago", "Pendente", "Cancelado", "Reembolsado"];
}
