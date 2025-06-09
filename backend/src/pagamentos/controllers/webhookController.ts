import { Request, Response, NextFunction } from "express";
import { handleWebhookService } from "../services/webhookService";

export async function webhookController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    console.log("📥 [Webhook] Evento recebido:", req.body);

    await handleWebhookService(req.body);

    res.status(200).send("OK");
  } catch (err: any) {
    console.error("❌ [Webhook] Erro ao processar webhook:", err.message || err);
    next(err);
  }
}
