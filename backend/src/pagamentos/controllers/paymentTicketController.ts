// backend/src/pagamentos/controllers/paymentTicketController.ts

import { supabase } from "../../supabase/supabaseAdmin";
import { v4 as uuidv4 } from "uuid";

interface TicketItem {
  eventId: string;
  eventName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Buyer {
  name: string;
  email: string;
}

interface PurchasePayload {
  buyer: Buyer;
  totalItems: number;
  totalPrice: number;
  items: TicketItem[];
  paymentMethod: "pix" | "card";
}

export async function createTicketsAfterPayment(
  payload: PurchasePayload,
  userId: string,
  paymentId?: string // ✅ agora aceita um terceiro argumento opcional
) {
  const tickets = payload.items.flatMap((item) =>
    Array.from({ length: item.quantity }).map(() => ({
      id: uuidv4(),
      user_id: userId,
      event_id: item.eventId,
      code: generateTicketCode(),
      status: "pendente",
      purchased_at: new Date().toISOString(),
      qr_code_url: null,
      is_downloaded: false,
      refunded_at: null,
      refund_requested_at: null,
      payment_id: paymentId ?? null, // ✅ salva se existir
    }))
  );

  const { data, error } = await supabase
    .from("tickets")
    .insert(tickets)
    .select("*");

  if (error) {
    console.error("❌ Erro ao gerar tickets:", error.message);
    throw new Error("Falha ao gerar ingressos.");
  }

  return data;
}

function generateTicketCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 8 })
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join("");
}
