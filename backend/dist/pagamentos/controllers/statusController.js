"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentStatus = getPaymentStatus;
const supabaseAdmin_1 = require("../../supabase/supabaseAdmin");
async function getPaymentStatus(req, res, next) {
    try {
        const { transactionId } = req.params;
        const result = await supabaseAdmin_1.supabase
            .from("payments")
            .select("status")
            .eq("transaction_id", transactionId)
            .single();
        if (result.error || !result.data) {
            res.status(404).json({ error: "Pagamento não encontrado." });
        }
        // Aqui o TS *ainda* reclama? Força a não nulidade:
        res.json({ status: result.data.status });
    }
    catch (err) {
        next(err);
    }
}
