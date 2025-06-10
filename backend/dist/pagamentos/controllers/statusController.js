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
exports.getPaymentStatus = getPaymentStatus;
const supabaseAdmin_1 = require("../../supabase/supabaseAdmin");
function getPaymentStatus(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { transactionId } = req.params;
            const result = yield supabaseAdmin_1.supabase
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
    });
}
