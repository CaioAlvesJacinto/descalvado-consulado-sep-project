// backend/src/pagamentos/integrations/checkoutIntegration.ts

import axios from "axios";
import { MP_ACCESS_TOKEN } from "../../config/env";

// Recebe o payload do service, mapeia para o modelo do Mercado Pago
export async function createPreferenceIntegration(payload: any) {
  // Mapeamento dos itens e payer conforme pede o Mercado Pago
  const preference = {
    items: payload.eventos.map((e: any) => ({
        id: e.eventoId,
        title: e.nameEvento,
        description: `Ingresso para evento ${e.nameEvento}`,
        category_id: "tickets",
        quantity: e.quantidade,
        unit_price: e.unitPrice,
    })),
    payer: {
        first_name: payload.comprador.name.split(" ")[0],
        last_name: payload.comprador.name.split(" ").slice(1).join(" ") || "-",
        email: payload.comprador.email,
    },
    external_reference: payload.externalReference ?? `COMPRA_${Date.now()}`,
    notification_url: process.env.MP_NOTIFICATION_URL,
    statement_descriptor: "PLATAFORMA INGRESSO", // <= Ajuste para o nome da sua plataforma
    };


  const { data } = await axios.post(
    "https://api.mercadopago.com/checkout/preferences",
    preference,
    {
      headers: {
        Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );

  return data;
}
