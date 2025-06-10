"use strict";
// backend/src/pagamentos/controllers/cardController.ts
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
exports.createCardController = createCardController;
const cardService_1 = require("../services/cardService");
function createCardController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("🔔 [Controller] Requisição recebida em POST /pagamentos/card");
        console.log("📥 [Controller] Body recebido:", JSON.stringify(req.body, null, 2));
        try {
            console.log("🚀 [Controller] Chamando createCardService...");
            const result = yield (0, cardService_1.createCardService)(req.body);
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
            console.error((err === null || err === void 0 ? void 0 : err.message) || err);
            console.log("📛 [Controller] Enviando erro ao middleware...");
            next(err);
        }
    });
}
