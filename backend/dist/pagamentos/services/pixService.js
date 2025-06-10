"use strict";
// backend/src/pagamentos/services/pixService.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPixService = createPixService;
const pixIntegration_1 = require("../integrations/pixIntegration");
const supabaseAdmin_1 = require("../../supabase/supabaseAdmin");
const pixTicketService_1 = require("./pixTicketService");
async function createPixService(req) {
    console.log("📥 [PixService] Payload recebido:", JSON.stringify(req, null, 2));
    // 1) Executa o pagamento no Mercado Pago
    let pixData;
    try {
        pixData = await (0, pixIntegration_1.createPixPayment)(req);
        console.log("✅ [PixService] Resposta do MP:", JSON.stringify(pixData, null, 2));
    }
    catch (err) {
        console.error("❌ [PixService] Erro ao chamar MP:", err.response?.data || err.message);
        throw err;
    }
    // 2) Busca o userId pelo e-mail do comprador
    let userId = null;
    try {
        const { data: userRecord, error } = await supabaseAdmin_1.supabase
            .from("users")
            .select("id")
            .eq("email", req.comprador.email)
            .single();
        if (!error && userRecord) {
            userId = userRecord.id;
            console.log("🔍 [PixService] userId encontrado:", userId);
        }
        else {
            console.warn("⚠️ [PixService] Usuário não encontrado ou erro:", error?.message);
        }
    }
    catch (err) {
        console.error("❌ [PixService] Exceção ao buscar user_id:", err);
    }
    // 3) Insere o registro de pagamento e retorna paymentId
    const transactionId = pixData.id.toString();
    const paymentRecord = {
        user_id: userId,
        method: "pix",
        status: pixData.status,
        amount: pixData.transaction_amount,
        transaction_id: transactionId,
        qr_code: pixData.point_of_interaction?.transaction_data?.qr_code ?? null,
        created_at: new Date().toISOString(),
        metadata: { purchasePayloadJson: JSON.stringify(req) },
    };
    console.log("📝 [PixService] Gravando payment:", JSON.stringify(paymentRecord, null, 2));
    const { data: insertedPayment, error: insertError } = await supabaseAdmin_1.supabase
        .from("payments")
        .insert(paymentRecord)
        .select("id")
        .single();
    const paymentId = insertedPayment?.id;
    if (insertError) {
        console.error("❌ [PixService] Erro ao inserir payment:", insertError.message);
    }
    else {
        console.log("✅ [PixService] Payment gravado com sucesso — ID:", paymentId);
    }
    // 4) Se aprovado, gera os tickets com paymentId
    if (pixData.status === "approved" && userId && paymentId) {
        console.log("🎫 [PixService] Pagamento aprovado, gerando tickets...");
        const tickets = await (0, pixTicketService_1.generateTicketsForPix)(req, userId, paymentId);
        const ticketIds = tickets.map((t) => t.id);
        console.log("✅ [PixService] Tickets gerados:", ticketIds);
        const { error: updateError } = await supabaseAdmin_1.supabase
            .from("payments")
            .update({ ticket_ids: ticketIds })
            .eq("id", paymentId);
        if (updateError) {
            console.error("❌ [PixService] Erro ao atualizar ticket_ids:", updateError.message);
        }
        else {
            console.log("✅ [PixService] ticket_ids atualizado no payment");
        }
    }
    // 5) Retorna o resultado final
    return {
        status: pixData.status === "approved"
            ? "APPROVED"
            : pixData.status === "pending"
                ? "PENDING"
                : "REJECTED",
        data: {
            ...pixData,
            transaction_id: transactionId // 👈 isso aqui garante que o front saiba o ID
        },
    };
}
