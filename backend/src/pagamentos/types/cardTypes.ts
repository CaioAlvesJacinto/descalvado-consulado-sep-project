export interface Comprador {
  name: string;
  email: string;
  tipoDocumento?: string;   // Ex: "CPF", "CNPJ"
  numeroDocumento: string;
}

export interface EventoCompra {
  eventoId: string;
  nameEvento: string;
  quantidade: number;
  unitPrice: number;
  totalPrice: number;
}

// new!
export interface BillingAddress {
  street: string;
  number: string;
  neighborhood?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface CardRequest {
  valor: number;
  descricao: string;
  comprador: Comprador;
  cardToken: string;
  installments: number;
  paymentMethodId: string;
  issuerId?: string;
  externalReference: string;

  eventos: EventoCompra[];

  /** optional billing address for risk check */
  billingAddress?: BillingAddress;
}

export interface CardResponse {
  id: number;
  status: string;
  transaction_amount: number;
  payer: { email: string };
  payment_method_id: string;
  card: {
    last_four_digits: string;
    cardholder?: {
      name?: string;
      identification?: {
        number?: string;
        type?: string;
      };
    };
  };
}
