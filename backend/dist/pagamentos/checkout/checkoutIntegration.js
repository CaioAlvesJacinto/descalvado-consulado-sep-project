"use strict";
// backend/src/pagamentos/integrations/checkoutIntegration.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPreferenceIntegration = createPreferenceIntegration;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../../config/env");
// Recebe o payload do service, mapeia para o modelo do Mercado Pago
async function createPreferenceIntegration(payload) {
    // Mapeamento dos itens e payer conforme pede o Mercado Pago
    const preference = {
        items: payload.eventos.map((e) => ({
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
    const { data } = await axios_1.default.post("https://api.mercadopago.com/checkout/preferences", preference, {
        headers: {
            Authorization: `Bearer ${env_1.MP_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
        },
    });
    return data;
}
