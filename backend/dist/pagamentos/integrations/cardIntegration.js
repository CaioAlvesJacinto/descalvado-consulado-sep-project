"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCardPayment = createCardPayment;
// backend/src/pagamentos/integrations/cardIntegration.ts
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../../config/env");
const crypto_1 = require("crypto");
const client = axios_1.default.create({
    baseURL: env_1.MP_BASE_URL,
    headers: {
        Authorization: `Bearer ${env_1.MP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
    },
});
function splitName(fullName) {
    const parts = fullName.trim().split(" ");
    return {
        first_name: parts[0] || "",
        last_name: parts.length > 1 ? parts.slice(1).join(" ") : "SILVA",
    };
}
function createCardPayment(req) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        console.log("📤 [cardIntegration] Iniciando criação de pagamento com cartão...");
        const { valor, descricao, comprador, cardToken, installments, eventos } = req;
        // Trata nome/sobrenome
        const { first_name, last_name } = splitName(comprador.name);
        // Cria array de items conforme recomendação Mercado Pago
        const items = (eventos === null || eventos === void 0 ? void 0 : eventos.map((evt, idx) => ({
            id: evt.eventoId || `item-${idx}`,
            title: evt.nameEvento || "Ingresso",
            description: evt.descricao || "Ingresso de evento",
            quantity: evt.quantidade || 1,
            unit_price: evt.unitPrice || valor,
            category_id: "tickets",
        }))) || [
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
        const externalReference = req.externalReference || (0, crypto_1.randomUUID)();
        // Monta o body completo
        const body = {
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
                    type: (_a = comprador.tipoDocumento) !== null && _a !== void 0 ? _a : "CPF",
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
            notification_url: env_1.MP_NOTIFICATION_URL || "https://webhook.site/seu-token-teste",
            statement_descriptor: "PLAT INGRESSO", // Altere para nome desejado na fatura (até 13 caracteres)
            external_reference: externalReference,
        };
        console.log("🧾 [cardIntegration] Payload enviado ao Mercado Pago:");
        console.dir(body, { depth: null });
        const idempotencyKey = (0, crypto_1.randomUUID)();
        console.log("🆔 [cardIntegration] Chave de idempotência:", idempotencyKey);
        try {
            const { data } = yield client.post("/v1/payments", body, {
                headers: {
                    "x-idempotency-key": idempotencyKey,
                },
            });
            console.log("✅ [cardIntegration] Pagamento criado com sucesso!");
            console.dir(data, { depth: null });
            return data;
        }
        catch (err) {
            console.error("❌ [cardIntegration] Erro ao criar pagamento com cartão:");
            console.error("📦 Payload que causou erro:", JSON.stringify(body, null, 2));
            if (err === null || err === void 0 ? void 0 : err.response) {
                console.error("📨 [cardIntegration] Erro da API Mercado Pago:", err.response.data);
            }
            else {
                console.error("📨 [cardIntegration] Erro genérico:", err.message);
            }
            throw new Error("Erro ao processar pagamento com cartão");
        }
    });
}
