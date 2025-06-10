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
exports.createPixPayment = createPixPayment;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../../config/env");
const crypto_1 = require("crypto"); // Node 14+
const client = axios_1.default.create({
    baseURL: env_1.MP_BASE_URL,
    headers: {
        Authorization: `Bearer ${env_1.MP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
    },
});
function createPixPayment(req) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        // Pode pegar o sobrenome se quiser (ajusta seu PixRequest para ter lastName)
        const firstName = ((_a = req.comprador.name) === null || _a === void 0 ? void 0 : _a.split(" ")[0]) || req.comprador.name;
        const lastName = ((_b = req.comprador.name) === null || _b === void 0 ? void 0 : _b.split(" ").slice(1).join(" ")) || " ";
        // Se não vier external_reference, gera um UUID (mas o ideal é sempre passar do backend)
        const externalReference = req.external_reference ||
            (((_c = req.comprador) === null || _c === void 0 ? void 0 : _c.email) ? `${req.comprador.email}-${Date.now()}` : (0, crypto_1.randomUUID)());
        // 1) Monta o body do pagamento
        const body = {
            transaction_amount: req.valor,
            description: req.descricao,
            payment_method_id: "pix",
            payer: {
                email: req.comprador.email,
                first_name: firstName,
                last_name: lastName,
            },
            notification_url: process.env.MP_NOTIFICATION_URL ||
                "https://webhook.site/seutoken", // Troque para seu endpoint real ao publicar
            external_reference: externalReference,
        };
        // 2) Gera um X-Idempotency-Key único para cada chamada
        const idempotencyKey = (0, crypto_1.randomUUID)();
        // 3) Faz o POST, passando o header x-idempotency-key
        try {
            console.log("📤 Enviando body para Mercado Pago:");
            console.dir(body, { depth: null });
            console.log("🔐 Headers:", {
                Authorization: `Bearer ${env_1.MP_ACCESS_TOKEN.slice(0, 10)}...`,
                "x-idempotency-key": idempotencyKey,
            });
            const { data } = yield client.post("/v1/payments", body, {
                headers: {
                    "x-idempotency-key": idempotencyKey,
                },
            });
            console.log("✅ Resposta do Mercado Pago:", JSON.stringify(data, null, 2));
            return data;
        }
        catch (err) {
            console.error("❌ Erro ao chamar o Mercado Pago:");
            console.error("Mensagem:", err.message);
            if (err.response) {
                console.error("Status:", err.response.status);
                console.error("Headers:", err.response.headers);
                console.error("Data:", JSON.stringify(err.response.data, null, 2));
            }
            else {
                console.error("Erro genérico:", err);
            }
            throw new Error("Dados de Pix incompletos ou inválidos.");
        }
    });
}
