"use strict";
// backend/src/pagamentos/controllers/pixController.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPixController = createPixController;
const pixService_1 = require("../services/pixService");
async function createPixController(req, res, next) {
    // Log do corpo recebido
    console.log("📥 [PixController] Body recebido:", JSON.stringify(req.body, null, 2));
    try {
        const result = await (0, pixService_1.createPixService)(req.body);
        // Log do resultado do serviço
        console.log("✅ [PixController] Resultado do serviço Pix:", {
            status: result.status,
            data: result.data,
        });
        res.status(200).json({
            status: result.status,
            data: result.data,
        });
    }
    catch (err) {
        // Log do erro antes de repassar ao middleware de erro
        console.error("❌ [PixController] Erro no controller Pix:", err.message || err);
        next(err);
    }
}
