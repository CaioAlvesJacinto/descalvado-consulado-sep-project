// backend/src/pagamentos/controllers/cardController.ts

import { Request, Response, NextFunction } from "express";
import { createCardService } from "../services/cardService";

export async function createCardController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  console.log("🔔 [Controller] Requisição recebida em POST /pagamentos/card");
  console.log("📥 [Controller] Body recebido:", JSON.stringify(req.body, null, 2));

  try {
    console.log("🚀 [Controller] Chamando createCardService...");
    const result = await createCardService(req.body);

    console.log("✅ [Controller] Resultado do serviço:");
    console.dir(result, { depth: null });

    res.status(200).json({
      status: result.status,
      data: result.data,
    });

    console.log("📤 [Controller] Resposta enviada com sucesso.");
  } catch (err: any) {
    console.error("❌ [Controller] Erro capturado:");
    console.error(err?.message || err);

    console.log("📛 [Controller] Enviando erro ao middleware...");
    next(err);
  }
}
