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
exports.generateTickets = generateTickets;
const supabaseAdmin_1 = require("../supabase/supabaseAdmin");
const ticketCrypto_1 = require("./qr/ticketCrypto");
const uuid_1 = require("uuid");
function generateTickets(_a) {
    return __awaiter(this, arguments, void 0, function* ({ userId, paymentId, items, holderName, }) {
        const tickets = [];
        // Para evitar race condition em compras simultâneas, processa 1 evento por vez!
        for (const item of items) {
            const { eventId, eventName, quantity } = item;
            // 1. Busca o evento para garantir estoque atualizado
            const { data: event, error: eventError } = yield supabaseAdmin_1.supabase
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
                const qrEncrypted = yield (0, ticketCrypto_1.generateQRCodeData)(JSON.stringify({
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
            const { error: updateError } = yield supabaseAdmin_1.supabase
                .from("events")
                .update({ sold_tickets: event.sold_tickets + quantity })
                .eq("id", eventId);
            if (updateError) {
                console.error("❌ Erro ao atualizar sold_tickets:", updateError.message);
                throw new Error("Erro ao atualizar ingressos vendidos do evento.");
            }
        }
        // 4. Insere todos os tickets de uma vez só
        const { error } = yield supabaseAdmin_1.supabase.from("tickets").insert(tickets);
        if (error) {
            console.error("❌ Erro ao salvar tickets:", error.message);
            throw new Error("Erro ao gerar tickets.");
        }
        console.log("✅ Tickets salvos:", tickets.map(t => t.id));
        return tickets;
    });
}
