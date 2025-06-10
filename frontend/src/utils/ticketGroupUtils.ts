// src/utils/ticketGroupUtils.ts

import { TicketInfo } from "@/types/ticket";

/**
 * Agrupa os ingressos por evento.
 * Retorna um objeto onde cada chave é o eventId e o valor é um array de tickets desse evento.
 * Exemplo de retorno:
 * {
 *   "eventId1": [ticket1, ticket2],
 *   "eventId2": [ticket3],
 * }
 */
export function groupTicketsByEvent(tickets: TicketInfo[]) {
  return tickets.reduce((acc, ticket) => {
    // Garante que cada grupo é inicializado
    if (!acc[ticket.event_id]) {
      acc[ticket.event_id] = [];
    }
    acc[ticket.event_id].push(ticket);
    return acc;
  }, {} as Record<string, TicketInfo[]>);
}
