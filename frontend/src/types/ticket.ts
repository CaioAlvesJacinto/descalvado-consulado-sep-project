// Ticket básico (unitário)
export interface TicketInfo  {
  id: string;
  code: string;                // Identificador único do ingresso (do QR ou banco)
  event_id: string;              // <-- Adicione aqui!
  eventName: string;
  holderName: string;
  purchaseDate: string;
  isValidated: boolean;
  validatedAt?: string;
  quantity?: number;
  totalPrice?: number;
  timestamp?: number;
  ticketNumber?: number;        // Para identificar qual ticket da compra (1 de 3, 2 de 3, etc)
  qrCodeUrl?: string;
}

// Para compras com múltiplos tickets
export interface TicketPurchase {
  purchaseId: string;
  tickets: TicketInfo[];
  totalQuantity: number;
  totalPrice: number;
  eventName: string;
  holderName: string;
  purchaseDate: string;
}

// Eventos favoritos do usuário
export interface FavoriteEvent {
  eventId: string;
  userId: string;
  addedAt: string;
  notificationsEnabled: boolean;
}

// Registro do histórico de validação de ingresso (para localStorage)
export interface ValidationRecord {
  id: string;
  ticketId: string;
  eventId: string;
  eventName: string;
  participantName: string;
  validatedAt: string;
  validatedBy: string;
  validatorName: string;
  ticketNumber?: number;
  status: "valid" | "invalid" | "used" | "expired";
}
