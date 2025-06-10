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
exports.handleWebhookService = handleWebhookService;
// backend/src/pagamentos/services/webhookService.ts
const supabaseAdmin_1 = require("../../supabase/supabaseAdmin");
const ticketService_1 = require("../../tickets/ticketService"); // Use o serviço genérico de tickets
function handleWebhookService(body) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        const { type, data } = body;
        // Só processa notificações de pagamento válidas
        if (type !== "payment" || !(data === null || data === void 0 ? void 0 : data.id)) {
            console.warn("🔔 Webhook ignorado: tipo inválido ou ID ausente.");
            return;
        }
        const paymentId = data.id;
        console.log(`📡 Buscando dados de pagamento [${paymentId}] no Mercado Pago`);
        // Busca detalhes do pagamento no Mercado Pago
        const response = yield fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
            headers: {
                Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
            },
        });
        if (!response.ok) {
            console.error("❌ Erro ao buscar detalhes do pagamento:", yield response.text());
            return;
        }
        const paymentData = yield response.json();
        const { id: transactionId, status, transaction_amount, payment_method_id, point_of_interaction, card, } = paymentData;
        // Atualiza o registro de pagamento
        const { data: paymentRecord, error: updateError } = yield supabaseAdmin_1.supabase
            .from("payments")
            .update({
            status,
            amount: transaction_amount,
            payment_method_id,
            qr_code: (_b = (_a = point_of_interaction === null || point_of_interaction === void 0 ? void 0 : point_of_interaction.transaction_data) === null || _a === void 0 ? void 0 : _a.qr_code) !== null && _b !== void 0 ? _b : null,
            boleto_url: null, // Atualize se usar boleto no futuro
            card_last_four: (_c = card === null || card === void 0 ? void 0 : card.last_four_digits) !== null && _c !== void 0 ? _c : null,
            card_holder_name: (_e = (_d = card === null || card === void 0 ? void 0 : card.cardholder) === null || _d === void 0 ? void 0 : _d.name) !== null && _e !== void 0 ? _e : null,
            card_holder_document: (_h = (_g = (_f = card === null || card === void 0 ? void 0 : card.cardholder) === null || _f === void 0 ? void 0 : _f.identification) === null || _g === void 0 ? void 0 : _g.number) !== null && _h !== void 0 ? _h : null,
            card_holder_document_type: (_l = (_k = (_j = card === null || card === void 0 ? void 0 : card.cardholder) === null || _j === void 0 ? void 0 : _j.identification) === null || _k === void 0 ? void 0 : _k.type) !== null && _l !== void 0 ? _l : null,
            updated_at: new Date().toISOString(),
        })
            .eq("transaction_id", transactionId.toString())
            .select("*")
            .single();
        if (updateError) {
            console.error("❌ Erro ao atualizar pagamento no Supabase:", updateError.message);
            return;
        }
        console.log(`✅ Pagamento ${transactionId} atualizado com status "${status}"`);
        // Se aprovado, gera tickets (apenas se ainda não existem)
        if (status === "approved" && paymentRecord) {
            if (paymentRecord.ticket_ids && paymentRecord.ticket_ids.length > 0) {
                console.log("🎫 Tickets já foram gerados para este pagamento, nada a fazer.");
                return;
            }
            // Recupera o payload original salvo no metadata
            let originalPayload = null;
            try {
                if (paymentRecord.metadata && paymentRecord.metadata.purchasePayloadJson) {
                    originalPayload = JSON.parse(paymentRecord.metadata.purchasePayloadJson);
                }
            }
            catch (e) {
                console.error("❌ Erro ao ler purchasePayloadJson:", e);
                return;
            }
            // Gera os tickets universalmente!
            if (originalPayload && paymentRecord.user_id) {
                try {
                    const tickets = yield (0, ticketService_1.generateTickets)({
                        userId: paymentRecord.user_id,
                        paymentId: paymentRecord.id,
                        items: originalPayload.eventos.map((ev) => ({
                            eventId: ev.eventoId,
                            eventName: ev.nameEvento,
                            quantity: ev.quantidade,
                            unitPrice: ev.unitPrice,
                            totalPrice: ev.totalPrice,
                        })),
                        holderName: ((_m = originalPayload.comprador) === null || _m === void 0 ? void 0 : _m.name) || "Comprador",
                    });
                    const ticketIds = tickets.map((t) => t.id);
                    // Atualiza o payment com ticket_ids
                    const { error: ticketUpdateError } = yield supabaseAdmin_1.supabase
                        .from("payments")
                        .update({ ticket_ids: ticketIds })
                        .eq("id", paymentRecord.id);
                    if (ticketUpdateError) {
                        console.error("❌ Erro ao atualizar ticket_ids no payment:", ticketUpdateError.message);
                    }
                    else {
                        console.log("✅ ticket_ids atualizado após aprovação do pagamento.");
                    }
                }
                catch (e) {
                    console.error("❌ Erro ao gerar tickets:", e);
                }
            }
            else {
                console.error("❌ Payload original ou user_id não encontrado, não é possível gerar tickets.");
            }
        }
    });
}
