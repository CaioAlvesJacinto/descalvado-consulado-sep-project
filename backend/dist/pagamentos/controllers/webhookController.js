"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhookController = webhookController;
const webhookService_1 = require("../services/webhookService");
async function webhookController(req, res, next) {
    try {
        console.log("📥 [Webhook] Evento recebido:", req.body);
        await (0, webhookService_1.handleWebhookService)(req.body);
        res.status(200).send("OK");
    }
    catch (err) {
        console.error("❌ [Webhook] Erro ao processar webhook:", err.message || err);
        next(err);
    }
}
