"use strict";
// backend/src/pagamentos/services/checkoutService.ts
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
exports.createPreferenceService = createPreferenceService;
const checkoutIntegration_1 = require("./checkoutIntegration");
function createPreferenceService(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        // Aqui você pode fazer validações, mapear campos, salvar registro se quiser
        // Normalmente só repassa para a integração:
        return yield (0, checkoutIntegration_1.createPreferenceIntegration)(payload);
    });
}
