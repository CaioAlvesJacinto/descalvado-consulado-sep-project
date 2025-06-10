"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cardValidator = cardValidator;
function cardValidator(req, res, next) {
    console.log("🔍 [cardValidator] Body chegando:", JSON.stringify(req.body, null, 2));
    const { valor, descricao, comprador, cardToken, installments, paymentMethodId, issuerId, billingAddress, eventos, } = req.body;
    // Validações básicas
    if (typeof valor !== "number" || valor <= 0 ||
        typeof descricao !== "string" || !descricao.trim() ||
        typeof cardToken !== "string" || !cardToken.trim() ||
        typeof installments !== "number" || installments <= 0 ||
        typeof paymentMethodId !== "string" || !paymentMethodId.trim() ||
        !comprador ||
        typeof comprador.name !== "string" || !comprador.name.trim() ||
        typeof comprador.email !== "string" || !comprador.email.trim() ||
        typeof comprador.numeroDocumento !== "string" || !comprador.numeroDocumento.trim() ||
        !Array.isArray(eventos) || eventos.length === 0) {
        console.warn("⚠️ [cardValidator] Dados principais inválidos:", req.body);
        res.status(400).json({ error: "Dados do cartão incompletos ou inválidos." });
    }
    // Documento
    if (comprador.tipoDocumento &&
        (typeof comprador.tipoDocumento !== "string" ||
            !["CPF", "CNPJ"].includes(comprador.tipoDocumento.toUpperCase()))) {
        console.warn("⚠️ [cardValidator] Tipo de documento inválido:", comprador.tipoDocumento);
        res.status(400).json({ error: "Tipo de documento inválido. Use CPF ou CNPJ." });
    }
    if (issuerId !== undefined && typeof issuerId !== "string") {
        console.warn("⚠️ [cardValidator] issuerId inválido:", issuerId);
        res.status(400).json({ error: "issuerId inválido. Deve ser uma string." });
    }
    if (billingAddress) {
        const { street, number, zipCode } = billingAddress;
        if (typeof street !== "string" || !street.trim() ||
            typeof number !== "string" || !number.trim() ||
            typeof zipCode !== "string" || !zipCode.trim()) {
            console.warn("⚠️ [cardValidator] Endereço de cobrança inválido:", billingAddress);
            res.status(400).json({ error: "Endereço de cobrança inválido." });
        }
    }
    // Validação de eventos
    for (const [i, evento] of eventos.entries()) {
        const { eventoId, nameEvento, quantidade, unitPrice, totalPrice } = evento;
        if (typeof eventoId !== "string" || !eventoId.trim() ||
            typeof nameEvento !== "string" || !nameEvento.trim() ||
            typeof quantidade !== "number" || quantidade <= 0 ||
            typeof unitPrice !== "number" || unitPrice < 0 ||
            typeof totalPrice !== "number" || totalPrice !== quantidade * unitPrice) {
            console.warn(`⚠️ [cardValidator] Evento inválido [${i}]:`, evento);
            res.status(400).json({ error: "Dados de evento inválidos dentro da lista." });
        }
    }
    console.log("✅ [cardValidator] Validação concluída com sucesso.");
    next();
}
