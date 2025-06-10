"use strict";
// backend/src/pagamentos/services/pixService.ts
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
exports.createPixService = createPixService;
const pixIntegration_1 = require("../integrations/pixIntegration");
const supabaseAdmin_1 = require("../../supabase/supabaseAdmin");
const pixTicketService_1 = require("./pixTicketService");
function createPixService(req) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        console.log("📥 [PixService] Payload recebido:", JSON.stringify(req, null, 2));
        // 1) Executa o pagamento no Mercado Pago
        let pixData;
        try {
            pixData = yield (0, pixIntegration_1.createPixPayment)(req);
            console.log("✅ [PixService] Resposta do MP:", JSON.stringify(pixData, null, 2));
        }
        catch (err) {
            console.error("❌ [PixService] Erro ao chamar MP:", ((_a = err.response) === null || _a === void 0 ? void 0 : _a.data) || err.message);
            throw err;
        }
        // 2) Busca o userId pelo e-mail do comprador
        let userId = null;
        try {
            const { data: userRecord, error } = yield supabaseAdmin_1.supabase
                .from("users")
                .select("id")
                .eq("email", req.comprador.email)
                .single();
            if (!error && userRecord) {
                userId = userRecord.id;
                console.log("🔍 [PixService] userId encontrado:", userId);
            }
            else {
                console.warn("⚠️ [PixService] Usuário não encontrado ou erro:", error === null || error === void 0 ? void 0 : error.message);
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
            qr_code: (_d = (_c = (_b = pixData.point_of_interaction) === null || _b === void 0 ? void 0 : _b.transaction_data) === null || _c === void 0 ? void 0 : _c.qr_code) !== null && _d !== void 0 ? _d : null,
            created_at: new Date().toISOString(),
            metadata: { purchasePayloadJson: JSON.stringify(req) },
        };
        console.log("📝 [PixService] Gravando payment:", JSON.stringify(paymentRecord, null, 2));
        const { data: insertedPayment, error: insertError } = yield supabaseAdmin_1.supabase
            .from("payments")
            .insert(paymentRecord)
            .select("id")
            .single();
        const paymentId = insertedPayment === null || insertedPayment === void 0 ? void 0 : insertedPayment.id;
        if (insertError) {
            console.error("❌ [PixService] Erro ao inserir payment:", insertError.message);
        }
        else {
            console.log("✅ [PixService] Payment gravado com sucesso — ID:", paymentId);
        }
        // 4) Se aprovado, gera os tickets com paymentId
        if (pixData.status === "approved" && userId && paymentId) {
            console.log("🎫 [PixService] Pagamento aprovado, gerando tickets...");
            const tickets = yield (0, pixTicketService_1.generateTicketsForPix)(req, userId, paymentId);
            const ticketIds = tickets.map((t) => t.id);
            console.log("✅ [PixService] Tickets gerados:", ticketIds);
            const { error: updateError } = yield supabaseAdmin_1.supabase
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
            data: Object.assign(Object.assign({}, pixData), { transaction_id: transactionId // 👈 isso aqui garante que o front saiba o ID
             }),
        };
    });
}
