"use strict";
// backend/src/pagamentos/services/cardTicketService.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTicketsForCard = generateTicketsForCard;
const paymentTicketController_1 = require("../controllers/paymentTicketController");
async function generateTicketsForCard(req, userId, paymentId) {
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
        const tickets = await (0, paymentTicketController_1.createTicketsAfterPayment)({
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
}
