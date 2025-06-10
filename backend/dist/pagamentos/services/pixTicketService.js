"use strict";
// backend/src/pagamentos/services/pixTicketService.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTicketsForPix = generateTicketsForPix;
const paymentTicketController_1 = require("../controllers/paymentTicketController");
async function generateTicketsForPix(req, userId, paymentId) {
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
    const tickets = await (0, paymentTicketController_1.createTicketsAfterPayment)({
        buyer: req.comprador,
        totalItems,
        totalPrice,
        items,
        paymentMethod: "pix",
    }, userId, paymentId);
    console.log("✅ [pixTicketService] Tickets criados:", tickets.map((t) => t.id));
    return tickets;
}
