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
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhookController = webhookController;
const webhookService_1 = require("../services/webhookService");
function webhookController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("📥 [Webhook] Evento recebido:", req.body);
            yield (0, webhookService_1.handleWebhookService)(req.body);
            res.status(200).send("OK");
        }
        catch (err) {
            console.error("❌ [Webhook] Erro ao processar webhook:", err.message || err);
            next(err);
        }
    });
}
