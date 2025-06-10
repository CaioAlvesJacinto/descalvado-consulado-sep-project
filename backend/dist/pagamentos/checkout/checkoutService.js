"use strict";
// backend/src/pagamentos/services/checkoutService.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPreferenceService = createPreferenceService;
const checkoutIntegration_1 = require("./checkoutIntegration");
async function createPreferenceService(payload) {
    // Aqui você pode fazer validações, mapear campos, salvar registro se quiser
    // Normalmente só repassa para a integração:
    return await (0, checkoutIntegration_1.createPreferenceIntegration)(payload);
}
