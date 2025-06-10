"use strict";
// backend/src/pagamentos/controllers/paymentTicketController.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTicketsAfterPayment = createTicketsAfterPayment;
const supabaseAdmin_1 = require("../../supabase/supabaseAdmin");
const uuid_1 = require("uuid");
async function createTicketsAfterPayment(payload, userId, paymentId // ✅ agora aceita um terceiro argumento opcional
) {
    const tickets = payload.items.flatMap((item) => Array.from({ length: item.quantity }).map(() => ({
        id: (0, uuid_1.v4)(),
        user_id: userId,
        event_id: item.eventId,
        code: generateTicketCode(),
        status: "pendente",
        purchased_at: new Date().toISOString(),
        qr_code_url: null,
        is_downloaded: false,
        refunded_at: null,
        refund_requested_at: null,
        payment_id: paymentId ?? null, // ✅ salva se existir
    })));
    const { data, error } = await supabaseAdmin_1.supabase
        .from("tickets")
        .insert(tickets)
        .select("*");
    if (error) {
        console.error("❌ Erro ao gerar tickets:", error.message);
        throw new Error("Falha ao gerar ingressos.");
    }
    return data;
}
function generateTicketCode() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    return Array.from({ length: 8 })
        .map(() => chars[Math.floor(Math.random() * chars.length)])
        .join("");
}
