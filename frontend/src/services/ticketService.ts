// src/services/ticketService.ts
import { supabase } from "@/integrations/supabase/supabaseClient";
import { TicketInfo } from "@/types/ticket";

// Busca os tickets reais comprados por um usuário
export async function getTicketsByUserId(userId: string): Promise<TicketInfo[]> {
  const { data, error } = await supabase
    .from("tickets")
    .select(
      `
      id,
      event_id,
      code,
      status,
      purchased_at,
      qr_code_url,
      is_downloaded,
      refunded_at,
      refund_requested_at,
      events (
        title,
        price
      )
    `
    )
    .eq("user_id", userId)
    .order("purchased_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar tickets:", error.message);
    return [];
  }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    event_id: row.event_id ?? row.eventId, // sempre preferir snake_case
    eventName: row.events?.title ?? "Evento desconhecido",
    holderName: "Você", // ou recuperar do user se necessário
    purchaseDate: new Date(row.purchased_at).toLocaleDateString(),
    isValidated: row.status === "validado",
    quantity: 1,
    totalPrice: Number(row.events?.price) ?? 0,
    qrCodeUrl: row.qr_code_url,
    code: row.code,
    isDownloaded: row.is_downloaded,
    refundedAt: row.refunded_at,
    refundRequestedAt: row.refund_requested_at,
    // adicione outros campos obrigatórios da sua interface aqui se faltar
  }));
}

// Função de verificação QR Code (sem alterações)
export function verifyTicketQRCode(qrData: string): {
  isValid: boolean;
  ticketData: any | null;
} {
  try {
    const decoded = atob(qrData);
    const json = JSON.parse(decoded);
    return {
      isValid: !!json?.ticketData,
      ticketData: json.ticketData,
    };
  } catch (error) {
    console.error("Erro ao verificar QR Code:", error);
    return { isValid: false, ticketData: null };
  }
}
