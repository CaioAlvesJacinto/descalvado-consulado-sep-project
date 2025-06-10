"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTickets = generateTickets;
const supabaseAdmin_1 = require("../supabase/supabaseAdmin");
const ticketCrypto_1 = require("./qr/ticketCrypto");
const uuid_1 = require("uuid");
async function generateTickets({ userId, paymentId, items, holderName, }) {
    const tickets = [];
    // Para evitar race condition em compras simultâneas, processa 1 evento por vez!
    for (const item of items) {
        const { eventId, eventName, quantity } = item;
        // 1. Busca o evento para garantir estoque atualizado
        const { data: event, error: eventError } = await supabaseAdmin_1.supabase
            .from("events")
            .select("available_tickets, sold_tickets")
            .eq("id", eventId)
            .single();
        if (eventError) {
            console.error("❌ Erro ao buscar evento:", eventError.message);
            throw new Error("Erro ao buscar evento.");
        }
        const ingressosRestantes = event.available_tickets - event.sold_tickets;
        if (quantity > ingressosRestantes) {
            throw new Error("Ingressos insuficientes para esse evento.");
        }
        // 2. Cria os tickets para esse evento
        for (let i = 0; i < quantity; i++) {
            const id = (0, uuid_1.v4)();
            const qrEncrypted = await (0, ticketCrypto_1.generateQRCodeData)(JSON.stringify({
                id,
                eventName,
                holderName,
                purchaseDate: new Date().toISOString(),
                isValidated: false,
                ticketNumber: i + 1,
            }));
            const ticket = {
                id,
                event_id: eventId,
                user_id: userId,
                code: `TKT-${eventId.slice(0, 6)}-${(0, uuid_1.v4)().slice(0, 6).toUpperCase()}`,
                status: "ativo",
                purchased_at: new Date().toISOString(),
                qr_code_url: qrEncrypted,
                payment_id: paymentId,
                is_downloaded: false,
            };
            tickets.push(ticket);
        }
        // 3. Atualiza o sold_tickets para o evento
        const { error: updateError } = await supabaseAdmin_1.supabase
            .from("events")
            .update({ sold_tickets: event.sold_tickets + quantity })
            .eq("id", eventId);
        if (updateError) {
            console.error("❌ Erro ao atualizar sold_tickets:", updateError.message);
            throw new Error("Erro ao atualizar ingressos vendidos do evento.");
        }
    }
    // 4. Insere todos os tickets de uma vez só
    const { error } = await supabaseAdmin_1.supabase.from("tickets").insert(tickets);
    if (error) {
        console.error("❌ Erro ao salvar tickets:", error.message);
        throw new Error("Erro ao gerar tickets.");
    }
    console.log("✅ Tickets salvos:", tickets.map(t => t.id));
    return tickets;
}
