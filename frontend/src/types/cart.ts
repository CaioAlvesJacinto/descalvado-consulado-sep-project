// src/types/cart.ts
import { Event } from "./event";

export interface CartItem {
  id: string;         // ID único do item no carrinho (ex: `${eventId}-${Date.now()}`)
  eventId: string;    // ID real do evento
  title: string;      // Nome do evento
  quantity: number;   // Quantidade de ingressos
  price: number;      // Preço unitário
}

// Função utilitária para criar um item de carrinho com base em um evento e uma quantidade
export function createCartTicketItem(event: Event, quantity: number): CartItem {
  return {
    id: `${event.id}-${Date.now()}`,
    eventId: event.id,
    title: event.title,
    quantity,
    price: event.price,
  };
}
