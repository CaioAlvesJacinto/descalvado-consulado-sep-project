"use strict";
// backend/src/pagamentos/validators/pixValidator.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.pixValidator = pixValidator;
function pixValidator(req, res, next) {
    console.log("🔍 [pixValidator] Body chegando:", JSON.stringify(req.body, null, 2));
    const { valor, descricao, comprador, eventos } = req.body;
    // Validações básicas do purchase
    if (typeof valor !== "number" || valor <= 0 ||
        typeof descricao !== "string" || !descricao.trim() ||
        !comprador ||
        typeof comprador.name !== "string" || !comprador.name.trim() ||
        typeof comprador.email !== "string" || !comprador.email.trim() ||
        !Array.isArray(eventos) || eventos.length === 0) {
        console.warn("⚠️ [pixValidator] Dados principais inválidos:", req.body);
        res.status(400).json({ error: "Dados de Pix incompletos ou inválidos." });
    }
    // Valida cada item em `eventos`
    for (const [i, item] of eventos.entries()) {
        const { eventoId, nameEvento, quantidade, unitPrice, totalPrice } = item;
        if (typeof eventoId !== "string" || !eventoId.trim() ||
            typeof nameEvento !== "string" || !nameEvento.trim() ||
            typeof quantidade !== "number" || quantidade <= 0 ||
            typeof unitPrice !== "number" || unitPrice < 0 ||
            typeof totalPrice !== "number" || totalPrice !== unitPrice * quantidade) {
            console.warn(`⚠️ [pixValidator] Item ${i} inválido em eventos:`, item);
            res.status(400).json({ error: "Dados de Pix incompletos ou inválidos." });
        }
    }
    next();
}
