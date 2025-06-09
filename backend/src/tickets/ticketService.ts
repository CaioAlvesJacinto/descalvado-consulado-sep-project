import { supabase } from "../supabase/supabaseAdmin";
import { generateQRCodeData } from "./qr/ticketCrypto";
import { v4 as uuidv4 } from "uuid";

interface TicketItem {
  eventId: string;
  eventName: string;
  quantity: number;
  unitPrice?: number;
  totalPrice?: number;
}

interface GenerateTicketsParams {
  userId: string;
  paymentId: string;
  items: TicketItem[];
  holderName: string;
}

export async function generateTickets({
  userId,
  paymentId,
  items,
  holderName,
}: GenerateTicketsParams) {
  const tickets = [];

  // Para evitar race condition em compras simultâneas, processa 1 evento por vez!
  for (const item of items) {
    const { eventId, eventName, quantity } = item;

    // 1. Busca o evento para garantir estoque atualizado
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("available_tickets, sold_tickets")
      .eq("id", eventId)
      .single();

    if (eventError) {
      console.error("❌ Erro ao buscar evento:", eventError.message);
      throw new Error("Erro ao buscar evento.");
    }

    const ingressosRestantes = event.available_tickets - event.sold_tickets;
    if (quantity > ingressosRestantes) {
      throw new Error("Ingressos insuficientes para esse evento.");
    }

    // 2. Cria os tickets para esse evento
    for (let i = 0; i < quantity; i++) {
      const id = uuidv4();

      const qrEncrypted = await generateQRCodeData(
        JSON.stringify({
          id,
          eventName,
          holderName,
          purchaseDate: new Date().toISOString(),
          isValidated: false,
          ticketNumber: i + 1,
        })
      );

      const ticket = {
        id,
        event_id: eventId,
        user_id: userId,
        code: `TKT-${eventId.slice(0, 6)}-${uuidv4().slice(0, 6).toUpperCase()}`,
        status: "ativo",
        purchased_at: new Date().toISOString(),
        qr_code_url: qrEncrypted,
        payment_id: paymentId,
        is_downloaded: false,
      };

      tickets.push(ticket);
    }

    // 3. Atualiza o sold_tickets para o evento
    const { error: updateError } = await supabase
      .from("events")
      .update({ sold_tickets: event.sold_tickets + quantity })
      .eq("id", eventId);

    if (updateError) {
      console.error("❌ Erro ao atualizar sold_tickets:", updateError.message);
      throw new Error("Erro ao atualizar ingressos vendidos do evento.");
    }
  }

  // 4. Insere todos os tickets de uma vez só
  const { error } = await supabase.from("tickets").insert(tickets);

  if (error) {
    console.error("❌ Erro ao salvar tickets:", error.message);
    throw new Error("Erro ao gerar tickets.");
  }

  console.log("✅ Tickets salvos:", tickets.map(t => t.id));
  return tickets;
}
