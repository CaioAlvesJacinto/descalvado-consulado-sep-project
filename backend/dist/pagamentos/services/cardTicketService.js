"use strict";
// backend/src/pagamentos/services/cardTicketService.ts
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
exports.generateTicketsForCard = generateTicketsForCard;
const paymentTicketController_1 = require("../controllers/paymentTicketController");
function generateTicketsForCard(req, userId, paymentId) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("📌 [cardTicketService] Início da geração de tickets...");
        console.log("📦 [cardTicketService] Dados recebidos:", {
            userId,
            paymentId,
            comprador: req.comprador,
            eventos: req.eventos,
        });
        if (!req.eventos || !Array.isArray(req.eventos) || req.eventos.length === 0) {
            console.error("❌ [cardTicketService] Nenhum evento encontrado no payload.");
            throw new Error("Dados de cartão ou ticket incompletos ou inválidos.");
        }
        const totalItems = req.eventos.reduce((sum, e) => sum + e.quantidade, 0);
        const totalPrice = req.valor;
        console.log(`🧮 [cardTicketService] Total de ingressos: ${totalItems}, Valor total: ${totalPrice}`);
        const items = req.eventos.map((e) => ({
            eventId: e.eventoId,
            eventName: e.nameEvento,
            quantity: e.quantidade,
            unitPrice: e.unitPrice,
            totalPrice: e.totalPrice,
        }));
        console.log("📋 [cardTicketService] Itens preparados para criação:", items);
        try {
            console.log("🚀 [cardTicketService] Chamando createTicketsAfterPayment...");
            const tickets = yield (0, paymentTicketController_1.createTicketsAfterPayment)({
                buyer: req.comprador,
                totalItems,
                totalPrice,
                items,
                paymentMethod: "card",
            }, userId, paymentId);
            const ticketIds = tickets.map((t) => t.id);
            console.log("✅ [cardTicketService] Tickets criados com sucesso:", ticketIds);
            return ticketIds;
        }
        catch (error) {
            console.error("❌ [cardTicketService] Erro ao criar tickets:", error.message || error);
            throw new Error("Erro ao gerar tickets.");
        }
    });
}
