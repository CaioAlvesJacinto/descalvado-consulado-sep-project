// backend/src/pagamentos/services/cardTicketService.ts

import { CardRequest } from "../types/cardTypes";
import { createTicketsAfterPayment } from "../controllers/paymentTicketController";

export async function generateTicketsForCard(
  req: CardRequest,
  userId: string,
  paymentId: string
): Promise<string[]> {
  console.log("📌 [cardTicketService] Início da geração de tickets...");
  console.log("📦 [cardTicketService] Dados recebidos:", {
    userId,
    paymentId,
    comprador: req.comprador,
    eventos: req.eventos,
  });

  if (!req.eventos || !Array.isArray(req.eventos) || req.eventos.length === 0) {
    console.error("❌ [cardTicketService] Nenhum evento encontrado no payload.");
    throw new Error("Dados de cartão ou ticket incompletos ou inválidos.");
  }

  const totalItems = req.eventos.reduce((sum, e) => sum + e.quantidade, 0);
  const totalPrice = req.valor;

  console.log(`🧮 [cardTicketService] Total de ingressos: ${totalItems}, Valor total: ${totalPrice}`);

  const items = req.eventos.map((e) => ({
    eventId: e.eventoId,
    eventName: e.nameEvento,
    quantity: e.quantidade,
    unitPrice: e.unitPrice,
    totalPrice: e.totalPrice,
  }));

  console.log("📋 [cardTicketService] Itens preparados para criação:", items);

  try {
    console.log("🚀 [cardTicketService] Chamando createTicketsAfterPayment...");
    const tickets = await createTicketsAfterPayment(
      {
        buyer: req.comprador,
        totalItems,
        totalPrice,
        items,
        paymentMethod: "card",
      },
      userId,
      paymentId
    );

    const ticketIds = tickets.map((t: any) => t.id);
    console.log("✅ [cardTicketService] Tickets criados com sucesso:", ticketIds);

    return ticketIds;
  } catch (error: any) {
    console.error("❌ [cardTicketService] Erro ao criar tickets:", error.message || error);
    throw new Error("Erro ao gerar tickets.");
  }
}
