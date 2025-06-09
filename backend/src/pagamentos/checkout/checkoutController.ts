// backend/src/pagamentos/controllers/checkoutController.ts

import { Request, Response, NextFunction } from "express";
import { createPreferenceService } from "./checkoutService";

export async function createPreferenceController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  console.log("🔔 [CheckoutController] Requisição recebida em POST /pagamentos/checkout/preference");
  console.log("📥 [CheckoutController] Body recebido:", JSON.stringify(req.body, null, 2));

  try {
    const preference = await createPreferenceService(req.body);

    // Retorna a resposta do Mercado Pago (ou só o link/init_point, se preferir)
    res.status(201).json({
      status: "CREATED",
      preference,
    });
    console.log("✅ [CheckoutController] Preference criada com sucesso.");
  } catch (err: any) {
    console.error("❌ [CheckoutController] Erro ao criar preference:", err.message || err);
    next(err);
  }
}
