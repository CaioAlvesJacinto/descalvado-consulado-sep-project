// backend/src/pagamentos/types/pixTypes.ts

export interface Comprador {
  name: string;
  email: string;
}

export interface EventoCompra {
  eventoId: string;
  nameEvento: string;
  quantidade: number;
  unitPrice: number;
  totalPrice: number;
}

export interface PixRequest {
  valor: number;              // valor total da compra
  descricao: string;
  comprador: Comprador;
  eventos: EventoCompra[];    // ✅ múltiplos eventos
  external_reference?: string;
}

export interface PixResponse {
  id: number;
  status: string;
  transaction_amount: number;
  transaction_id?: string; // 👈 Adicionado aqui
  point_of_interaction?: {
    transaction_data?: {
      qr_code?: string;
      qr_code_base64?: string; // 💡 Se for usar no front
    };
  };
  payer?: {
    email?: string;
  };
}
