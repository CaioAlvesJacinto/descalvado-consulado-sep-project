import { TicketInfo } from "@/types/ticket";
import { provideFeedback } from "./feedbackService";
import { verifyTicketQRCode } from "./ticketService";

export type ValidationStatus = "idle" | "valid" | "invalid" | "used" | "expired" | "tampered";

/**
 * Valida um QR code e retorna status, informações do ticket e mensagem
 */
export const validateTicketQRCode = (qrData: string): {
  status: ValidationStatus;
  ticketInfo: TicketInfo | null;
  message?: string;
} => {
  try {
    // Tenta decodificar e verificar o QR code
    const { isValid, ticketData } = verifyTicketQRCode(qrData);

    if (!isValid || !ticketData) {
      if (window.vibrationEnabled !== false || window.soundEnabled !== false) {
        provideFeedback('invalid');
      }
      return {
        status: "tampered",
        ticketInfo: null,
        message: "Este QR Code foi adulterado ou é inválido."
      };
    }

    const currentTime = new Date().toLocaleString();
    const now = Date.now();

    // Verifica expiração (ajuste conforme regra real)
    if (ticketData.timestamp && (now - ticketData.timestamp > 7 * 24 * 60 * 60 * 1000)) {
      if (window.vibrationEnabled !== false || window.soundEnabled !== false) {
        provideFeedback('invalid');
      }
      return {
        status: "expired",
        ticketInfo: {
          id: ticketData.id,
          event_id: ticketData.event_id, // <-- Adicionado aqui
          code: ticketData.code || ticketData.id,
          eventName: ticketData.eventName,
          holderName: ticketData.holderName,
          purchaseDate: ticketData.purchaseDate,
          isValidated: false,
          validatedAt: currentTime,
          timestamp: ticketData.timestamp,
          ticketNumber: ticketData.ticketNumber || 1,
          // Adicione outros campos obrigatórios da sua interface, se necessário
        } as TicketInfo,
        message: "Este ingresso expirou."
      };
    }

    // --- Aqui você deve consultar o backend real para saber se está usado ---
    // Exemplo: if (ticketData.status === "used") { ... }
    // Por enquanto, assume que o campo status está vindo do QR code/ticketData
    if (ticketData.status === "used") {
      const ticketInfo: TicketInfo = {
        id: ticketData.id,
        event_id: ticketData.event_id, // <-- Adicionado aqui
        code: ticketData.code || ticketData.id,
        eventName: ticketData.eventName,
        holderName: ticketData.holderName,
        purchaseDate: ticketData.purchaseDate,
        isValidated: true,
        validatedAt: currentTime,
        timestamp: ticketData.timestamp,
        ticketNumber: ticketData.ticketNumber || 1,
        quantity: ticketData.quantity || 1,
      };
      if (window.vibrationEnabled !== false || window.soundEnabled !== false) {
        provideFeedback('used');
      }
      return {
        status: "used",
        ticketInfo,
        message: "Este ingresso já foi utilizado anteriormente."
      };
    }

    // Ingresso válido
    const ticketInfo: TicketInfo = {
      id: ticketData.id,
      event_id: ticketData.event_id, // <-- Adicionado aqui
      code: ticketData.code || ticketData.id,
      eventName: ticketData.eventName,
      holderName: ticketData.holderName,
      purchaseDate: ticketData.purchaseDate,
      isValidated: false,
      validatedAt: currentTime,
      timestamp: ticketData.timestamp,
      ticketNumber: ticketData.ticketNumber || 1,
      quantity: ticketData.quantity || 1,
    };
    if (window.vibrationEnabled !== false || window.soundEnabled !== false) {
      provideFeedback('valid');
    }
    return {
      status: "valid",
      ticketInfo,
      message: `Ingresso válido!${ticketData.ticketNumber ? ` (${ticketData.ticketNumber}º ingresso)` : ''}`
    };

  } catch (error) {
    console.error("Error parsing QR code:", error);

    if (window.vibrationEnabled !== false || window.soundEnabled !== false) {
      provideFeedback('invalid');
    }
    return {
      status: "invalid",
      ticketInfo: null,
      message: "QR Code inválido ou não reconhecido."
    };
  }
};
