import { supabase } from "@/integrations/supabase/supabaseClient";

// Cria um check-in para o ticket
export async function saveCheckIn({
  ticketId,
  checkedBy,
  status = "checked_in"
}: {
  ticketId: string,
  checkedBy: string,
  status?: string
}) {
  const { data, error } = await supabase
    .from("checkins")
    .insert({
      ticket_id: ticketId,
      checked_by: checkedBy,
      checked_at: new Date().toISOString(),
      status,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// (Opcional) Atualizar o status do ticket para "used"
export async function markTicketAsUsed(ticketId: string) {
  const { error } = await supabase
    .from("tickets")
    .update({ status: "used" })
    .eq("id", ticketId);

  if (error) throw error;
}
