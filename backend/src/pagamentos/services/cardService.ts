import { createCardPayment } from "../integrations/cardIntegration";
import { supabase } from "../../supabase/supabaseAdmin";
import { CardRequest, CardResponse } from "../types/cardTypes";
import { generateTicketsForCard } from "./cardTicketService";

export interface CardResult {
  status: "PENDING" | "APPROVED" | "REJECTED";
  data: CardResponse;
}

export async function createCardService(req: CardRequest): Promise<CardResult> {
  console.log("📥 [CardService] Payload recebido:", JSON.stringify(req, null, 2));

  // Validação básica do payload
  if (!req.comprador || !req.cardToken || !req.valor || !req.eventos?.length) {
    console.error("❌ [CardService] Campos obrigatórios faltando:", {
      comprador: req.comprador,
      cardToken: req.cardToken,
      valor: req.valor,
      eventos: req.eventos,
    });
    throw new Error("Dados de cartão ou ticket incompletos ou inválidos.");
  }

  let cardData: CardResponse;
  try {
    console.log("📡 [CardService] Enviando para Mercado Pago...");
    cardData = await createCardPayment(req);
    console.log("✅ [CardService] Resposta MP:", JSON.stringify(cardData, null, 2));
  } catch (err: any) {
    console.error("❌ [CardService] Erro no MP:", err.response?.data || err.message);
    throw err;
  }

  let userId: string | null = null;
  try {
    console.log("🔍 [CardService] Buscando usuário por e-mail:", cardData.payer.email);
    const { data: userRecord, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", cardData.payer.email)
      .single();

    if (userError) {
      console.warn("⚠️ [CardService] Erro ao buscar usuário:", userError.message);
    } else if (!userRecord) {
      console.warn("⚠️ [CardService] Nenhum usuário encontrado.");
    } else {
      userId = userRecord.id;
      console.log("✅ [CardService] Usuário encontrado:", userId);
    }
  } catch (err) {
    console.error("❌ [CardService] Erro inesperado ao buscar usuário:", err);
  }

  const paymentRecord: any = {
    user_id: userId,
    method: "card",
    status: cardData.status,
    amount: cardData.transaction_amount,
    transaction_id: cardData.id.toString(),
    payment_method_id: cardData.payment_method_id,
    card_last_four: cardData.card.last_four_digits,
    card_holder_name: cardData.card.cardholder?.name ?? req.comprador.name,
    card_holder_document:
      cardData.card.cardholder?.identification?.number ?? req.comprador.numeroDocumento,
    card_holder_document_type:
      cardData.card.cardholder?.identification?.type ?? req.comprador.tipoDocumento,
    issuer_id: req.issuerId ?? null,
    billing_address: req.billingAddress ? JSON.stringify(req.billingAddress) : null,
    created_at: new Date().toISOString(),
    // 👇 ESSA LINHA É FUNDAMENTAL 👇
    metadata: { purchasePayloadJson: JSON.stringify(req) },
  };

  console.log("💾 [CardService] Inserindo pagamento no Supabase:", paymentRecord);

  const { data: inserted, error: insertError } = await supabase
    .from("payments")
    .insert(paymentRecord)
    .select("id")
    .single();

  if (insertError) {
    console.error("❌ [CardService] Erro ao inserir payment:", insertError.message);
  } else {
    console.log("✅ [CardService] Pagamento registrado com ID:", inserted?.id);
  }

  const paymentId = inserted?.id as string;

  if (cardData.status === "approved" && userId && paymentId) {
    console.log("🎫 [CardService] Pagamento aprovado. Gerando tickets...");
    try {
      const ticketIds = await generateTicketsForCard(req, userId, paymentId);

      console.log("✅ [CardService] Tickets gerados:", ticketIds);

      const { error: updateError } = await supabase
        .from("payments")
        .update({ ticket_ids: ticketIds.map((id) => id.toString()) })
        .eq("id", paymentId);

      if (updateError) {
        console.error("❌ [CardService] Erro ao atualizar ticket_ids:", updateError.message);
      } else {
        console.log("✅ [CardService] ticket_ids atualizados no pagamento.");
      }
    } catch (err) {
      console.error("❌ [CardService] Erro ao gerar ou atualizar tickets:", err);
    }
  } else {
    console.warn("⚠️ [CardService] Pagamento não aprovado ou dados incompletos. Tickets não gerados.");
  }

  return {
    status:
      cardData.status === "approved"
        ? "APPROVED"
        : cardData.status === "pending"
        ? "PENDING"
        : "REJECTED",
    data: cardData,
  };
}
