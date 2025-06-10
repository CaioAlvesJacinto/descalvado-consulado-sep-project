"use strict";
// backend/src/pagamentos/controllers/checkoutController.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPreferenceController = createPreferenceController;
const checkoutService_1 = require("./checkoutService");
async function createPreferenceController(req, res, next) {
    console.log("🔔 [CheckoutController] Requisição recebida em POST /pagamentos/checkout/preference");
    console.log("📥 [CheckoutController] Body recebido:", JSON.stringify(req.body, null, 2));
    try {
        const preference = await (0, checkoutService_1.createPreferenceService)(req.body);
        // Retorna a resposta do Mercado Pago (ou só o link/init_point, se preferir)
        res.status(201).json({
            status: "CREATED",
            preference,
        });
        console.log("✅ [CheckoutController] Preference criada com sucesso.");
    }
    catch (err) {
        console.error("❌ [CheckoutController] Erro ao criar preference:", err.message || err);
        next(err);
    }
}
