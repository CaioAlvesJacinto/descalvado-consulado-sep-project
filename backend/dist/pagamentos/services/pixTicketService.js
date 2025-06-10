"use strict";
// backend/src/pagamentos/services/pixTicketService.ts
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
exports.generateTicketsForPix = generateTicketsForPix;
const paymentTicketController_1 = require("../controllers/paymentTicketController");
function generateTicketsForPix(req, userId, paymentId) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("🎫 [pixTicketService] Gerando tickets para eventos:", JSON.stringify(req.eventos, null, 2), "userId:", userId, "paymentId:", paymentId);
        const totalItems = req.eventos.reduce((sum, e) => sum + e.quantidade, 0);
        const totalPrice = req.valor;
        const items = req.eventos.map((e) => ({
            eventId: e.eventoId,
            eventName: e.nameEvento,
            quantity: e.quantidade,
            unitPrice: e.unitPrice,
            totalPrice: e.totalPrice,
        }));
        const tickets = yield (0, paymentTicketController_1.createTicketsAfterPayment)({
            buyer: req.comprador,
            totalItems,
            totalPrice,
            items,
            paymentMethod: "pix",
        }, userId, paymentId);
        console.log("✅ [pixTicketService] Tickets criados:", tickets.map((t) => t.id));
        return tickets;
    });
}
