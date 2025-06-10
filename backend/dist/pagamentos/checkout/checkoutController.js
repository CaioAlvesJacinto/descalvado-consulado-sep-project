"use strict";
// backend/src/pagamentos/controllers/checkoutController.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPreferenceController = createPreferenceController;
const checkoutService_1 = require("./checkoutService");
function createPreferenceController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("🔔 [CheckoutController] Requisição recebida em POST /pagamentos/checkout/preference");
        console.log("📥 [CheckoutController] Body recebido:", JSON.stringify(req.body, null, 2));
        try {
            const preference = yield (0, checkoutService_1.createPreferenceService)(req.body);
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
    });
}
