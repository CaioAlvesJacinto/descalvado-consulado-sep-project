// backend/src/pagamentos/controllers/pixController.ts

import { Request, Response, NextFunction } from "express";
import { createPixService } from "../services/pixService";

export async function createPixController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  // Log do corpo recebido
  console.log("📥 [PixController] Body recebido:", JSON.stringify(req.body, null, 2));

  try {
    const result = await createPixService(req.body);

    // Log do resultado do serviço
    console.log("✅ [PixController] Resultado do serviço Pix:", {
      status: result.status,
      data: result.data,
    });

    res.status(200).json({
      status: result.status,
      data: result.data,
    });
  } catch (err: any) {
    // Log do erro antes de repassar ao middleware de erro
    console.error("❌ [PixController] Erro no controller Pix:", err.message || err);
    next(err);
  }
}
