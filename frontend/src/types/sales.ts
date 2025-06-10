export type PaymentStatus = "Pago" | "Pendente" | "Cancelado" | "Reembolsado";

export interface BaseSale {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;         // ISO (data da compra ou do pedido)
  amount: number;
  quantity: number;
  status: PaymentStatus;
  paymentMethod: "PIX" | "Cartão de Crédito" | "Cartão de Débito" | "Boleto";
  created_at?: string;  // gerado pelo Supabase
  updated_at?: string;
}

export interface TicketSale extends BaseSale {
  type: "Ingresso";
  eventId: string;
  eventName: string;
  ticketCode: string;
}

export interface MerchandiseSale extends BaseSale {
  type: "Produto";
  merchandiseId: string;
  merchandiseName: string;
  size?: string;
  color?: string;
}

export type Sale = TicketSale | MerchandiseSale;

/* --------------------- filtros usados na UI ---------------------- */
export interface SalesFilters {
  dateFrom?: string;
  dateTo?: string;
  eventId?: string;
  merchandiseId?: string;
  status?: PaymentStatus | "";
  type?: "Ingresso" | "Produto" | "";
}

/* --------------------- KPIs resumidos ---------------------------- */
export interface SalesStats {
  totalRevenue: number;
  totalSales: number;
  ticketSales: number;
  merchandiseSales: number;
  avgOrderValue: number;
}
