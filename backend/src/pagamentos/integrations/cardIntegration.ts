// backend/src/pagamentos/integrations/cardIntegration.ts
import axios from "axios";
import { CardRequest, CardResponse } from "../types/cardTypes";
import { MP_BASE_URL, MP_ACCESS_TOKEN, MP_NOTIFICATION_URL } from "../../config/env";
import { randomUUID } from "crypto";

const client = axios.create({
  baseURL: MP_BASE_URL,
  headers: {
    Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  },
});

function splitName(fullName: string) {
  const parts = fullName.trim().split(" ");
  return {
    first_name: parts[0] || "",
    last_name: parts.length > 1 ? parts.slice(1).join(" ") : "SILVA",
  };
}

export async function createCardPayment(req: CardRequest): Promise<CardResponse> {
  console.log("📤 [cardIntegration] Iniciando criação de pagamento com cartão...");

  const { valor, descricao, comprador, cardToken, installments, eventos } = req;

  // Trata nome/sobrenome
  const { first_name, last_name } = splitName(comprador.name);

  // Cria array de items conforme recomendação Mercado Pago
  const items =
    eventos?.map((evt: any, idx: number) => ({
      id: evt.eventoId || `item-${idx}`,
      title: evt.nameEvento || "Ingresso",
      description: evt.descricao || "Ingresso de evento",
      quantity: evt.quantidade || 1,
      unit_price: evt.unitPrice || valor,
      category_id: "tickets",
    })) || [
      {
        id: "ingresso",
        title: "Ingresso",
        description: descricao,
        quantity: 1,
        unit_price: valor,
        category_id: "tickets",
      },
    ];

  // Adiciona external_reference único por transação
  const externalReference = req.externalReference || randomUUID();

  // Monta o body completo
  const body: any = {
    transaction_amount: valor,
    description: descricao,
    token: cardToken,
    installments: installments,
    payment_method_id: req.paymentMethodId,
    issuer_id: req.issuerId,
    payer: {
      email: comprador.email,
      first_name,
      last_name,
      identification: {
        type: comprador.tipoDocumento ?? "CPF",
        number: comprador.numeroDocumento,
      },
      address: req.billingAddress
        ? {
            street_name: req.billingAddress.street,
            street_number: req.billingAddress.number,
            zip_code: req.billingAddress.zipCode,
          }
        : undefined,
    },
    items,
    notification_url: MP_NOTIFICATION_URL || "https://webhook.site/seu-token-teste",
    statement_descriptor: "PLAT INGRESSO", // Altere para nome desejado na fatura (até 13 caracteres)
    external_reference: externalReference,
  };

  console.log("🧾 [cardIntegration] Payload enviado ao Mercado Pago:");
  console.dir(body, { depth: null });

  const idempotencyKey = randomUUID();
  console.log("🆔 [cardIntegration] Chave de idempotência:", idempotencyKey);

  try {
    const { data } = await client.post<CardResponse>(
      "/v1/payments",
      body,
      {
        headers: {
          "x-idempotency-key": idempotencyKey,
        },
      }
    );

    console.log("✅ [cardIntegration] Pagamento criado com sucesso!");
    console.dir(data, { depth: null });

    return data;
  } catch (err: any) {
    console.error("❌ [cardIntegration] Erro ao criar pagamento com cartão:");
    console.error("📦 Payload que causou erro:", JSON.stringify(body, null, 2));
    if (err?.response) {
      console.error("📨 [cardIntegration] Erro da API Mercado Pago:", err.response.data);
    } else {
      console.error("📨 [cardIntegration] Erro genérico:", err.message);
    }
    throw new Error("Erro ao processar pagamento com cartão");
  }
}
