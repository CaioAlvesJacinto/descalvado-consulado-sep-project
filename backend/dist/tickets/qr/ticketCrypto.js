"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQRCodeData = generateQRCodeData;
// backend/src/tickets/qr/ticketCrypto.ts
const qrcode_1 = __importDefault(require("qrcode"));
// A informação no QR é um JSON codificado. Não precisa de hashing.
function generateQRCodeData(content) {
    return qrcode_1.default.toDataURL(content)
        .then((qr) => {
        console.log("🎫 QR gerado para:", content.slice(0, 100)); // evita log gigante
        return qr;
    })
        .catch((err) => {
        console.error("❌ Erro ao gerar QR code:", err);
        return "";
    });
}
