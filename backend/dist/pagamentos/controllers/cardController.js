"use strict";
// backend/src/pagamentos/controllers/cardController.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCardController = createCardController;
const cardService_1 = require("../services/cardService");
async function createCardController(req, res, next) {
    console.log("🔔 [Controller] Requisição recebida em POST /pagamentos/card");
    console.log("📥 [Controller] Body recebido:", JSON.stringify(req.body, null, 2));
    try {
        console.log("🚀 [Controller] Chamando createCardService...");
        const result = await (0, cardService_1.createCardService)(req.body);
        console.log("✅ [Controller] Resultado do serviço:");
        console.dir(result, { depth: null });
        res.status(200).json({
            status: result.status,
            data: result.data,
        });
        console.log("📤 [Controller] Resposta enviada com sucesso.");
    }
    catch (err) {
        console.error("❌ [Controller] Erro capturado:");
        console.error(err?.message || err);
        console.log("📛 [Controller] Enviando erro ao middleware...");
        next(err);
    }
}
