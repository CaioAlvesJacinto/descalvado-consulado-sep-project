"use strict";
// backend/src/pagamentos/controllers/pixController.ts
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
exports.createPixController = createPixController;
const pixService_1 = require("../services/pixService");
function createPixController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Log do corpo recebido
        console.log("📥 [PixController] Body recebido:", JSON.stringify(req.body, null, 2));
        try {
            const result = yield (0, pixService_1.createPixService)(req.body);
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
    });
}
