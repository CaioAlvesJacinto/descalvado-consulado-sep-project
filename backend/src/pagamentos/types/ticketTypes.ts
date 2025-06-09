// backend/src/pagamentos/types/ticketTypes.ts

export interface TicketItem {
  eventId: string;
  eventName: string;
  quantity: number;
}

export interface BuyerInfo {
  name: string;
  email: string;
  numeroDocumento: string;
  tipoDocumento: string;
}

export interface PixTicketRequest {
  buyer: BuyerInfo;
  totalPrice: number;
  items: TicketItem[];
}

export interface CardTicketRequest extends PixTicketRequest {
  token: string;
  installments: number;
  paymentMethodId: string;
  issuerId: string;
}
