// backend/src/tickets/qr/ticketCrypto.ts
import QRCode from "qrcode";

// A informação no QR é um JSON codificado. Não precisa de hashing.

export function generateQRCodeData(content: string): Promise<string> {
  return QRCode.toDataURL(content)
    .then((qr) => {
      console.log("🎫 QR gerado para:", content.slice(0, 100)); // evita log gigante
      return qr;
    })
    .catch((err) => {
      console.error("❌ Erro ao gerar QR code:", err);
      return "";
    });
}