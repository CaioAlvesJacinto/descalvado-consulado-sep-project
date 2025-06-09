// backend/src/pagamentos/services/webhookService.ts
import { supabase } from "../../supabase/supabaseAdmin";
import { generateTickets } from "../../tickets/ticketService"; // Use o serviço genérico de tickets

export async function handleWebhookService(body: any): Promise<void> {
  const { type, data } = body;

  // Só processa notificações de pagamento válidas
  if (type !== "payment" || !data?.id) {
    console.warn("🔔 Webhook ignorado: tipo inválido ou ID ausente.");
    return;
  }

  const paymentId = data.id;

  console.log(`📡 Buscando dados de pagamento [${paymentId}] no Mercado Pago`);

  // Busca detalhes do pagamento no Mercado Pago
  const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: {
      Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
    },
  });

  if (!response.ok) {
    console.error("❌ Erro ao buscar detalhes do pagamento:", await response.text());
    return;
  }

  const paymentData = await response.json();

  const {
    id: transactionId,
    status,
    transaction_amount,
    payment_method_id,
    point_of_interaction,
    card,
  } = paymentData;

  // Atualiza o registro de pagamento
  const { data: paymentRecord, error: updateError } = await supabase
    .from("payments")
    .update({
      status,
      amount: transaction_amount,
      payment_method_id,
      qr_code: point_of_interaction?.transaction_data?.qr_code ?? null,
      boleto_url: null, // Atualize se usar boleto no futuro
      card_last_four: card?.last_four_digits ?? null,
      card_holder_name: card?.cardholder?.name ?? null,
      card_holder_document: card?.cardholder?.identification?.number ?? null,
      card_holder_document_type: card?.cardholder?.identification?.type ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("transaction_id", transactionId.toString())
    .select("*")
    .single();

  if (updateError) {
    console.error("❌ Erro ao atualizar pagamento no Supabase:", updateError.message);
    return;
  }
  console.log(`✅ Pagamento ${transactionId} atualizado com status "${status}"`);

  // Se aprovado, gera tickets (apenas se ainda não existem)
  if (status === "approved" && paymentRecord) {
    if (paymentRecord.ticket_ids && paymentRecord.ticket_ids.length > 0) {
      console.log("🎫 Tickets já foram gerados para este pagamento, nada a fazer.");
      return;
    }

    // Recupera o payload original salvo no metadata
    let originalPayload = null;
    try {
      if (paymentRecord.metadata && paymentRecord.metadata.purchasePayloadJson) {
        originalPayload = JSON.parse(paymentRecord.metadata.purchasePayloadJson);
      }
    } catch (e) {
      console.error("❌ Erro ao ler purchasePayloadJson:", e);
      return;
    }

    // Gera os tickets universalmente!
    if (originalPayload && paymentRecord.user_id) {
      try {
        const tickets = await generateTickets({
          userId: paymentRecord.user_id,
          paymentId: paymentRecord.id,
          items: originalPayload.eventos.map((ev: any) => ({
            eventId: ev.eventoId,
            eventName: ev.nameEvento,
            quantity: ev.quantidade,
            unitPrice: ev.unitPrice,
            totalPrice: ev.totalPrice,
          })),
          holderName: originalPayload.comprador?.name || "Comprador",
        });

        const ticketIds = tickets.map((t: any) => t.id);

        // Atualiza o payment com ticket_ids
        const { error: ticketUpdateError } = await supabase
          .from("payments")
          .update({ ticket_ids: ticketIds })
          .eq("id", paymentRecord.id);

        if (ticketUpdateError) {
          console.error("❌ Erro ao atualizar ticket_ids no payment:", ticketUpdateError.message);
        } else {
          console.log("✅ ticket_ids atualizado após aprovação do pagamento.");
        }
      } catch (e) {
        console.error("❌ Erro ao gerar tickets:", e);
      }
    } else {
      console.error("❌ Payload original ou user_id não encontrado, não é possível gerar tickets.");
    }
  }
}
