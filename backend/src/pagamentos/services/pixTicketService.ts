// backend/src/pagamentos/services/pixTicketService.ts

import { createTicketsAfterPayment } from "../controllers/paymentTicketController";
import { PixRequest } from "../types/pixTypes";

export interface GeneratedTicket {
  id: string;
  event_id: string;
  user_id: string;
  code: string;
  // … outros campos se necessário
}

export async function generateTicketsForPix(
  req: PixRequest,
  userId: string,
  paymentId: string
): Promise<GeneratedTicket[]> {
  console.log(
    "🎫 [pixTicketService] Gerando tickets para eventos:",
    JSON.stringify(req.eventos, null, 2),
    "userId:", userId,
    "paymentId:", paymentId
  );

  const totalItems = req.eventos.reduce((sum, e) => sum + e.quantidade, 0);
  const totalPrice = req.valor;

  const items = req.eventos.map((e) => ({
    eventId: e.eventoId,
    eventName: e.nameEvento,
    quantity: e.quantidade,
    unitPrice: e.unitPrice,
    totalPrice: e.totalPrice,
  }));

  const tickets: GeneratedTicket[] = await createTicketsAfterPayment(
    {
      buyer: req.comprador,
      totalItems,
      totalPrice,
      items,
      paymentMethod: "pix",
    },
    userId,
    paymentId
  );

  console.log("✅ [pixTicketService] Tickets criados:", tickets.map((t) => t.id));
  return tickets;
}
