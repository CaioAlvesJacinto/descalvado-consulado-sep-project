// backend/src/pagamentos/controllers/statusController.ts
import { Request, Response, NextFunction } from "express";
import { supabase } from "../../supabase/supabaseAdmin";

export async function getPaymentStatus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { transactionId } = req.params;

    const result = await supabase
      .from("payments")
      .select("status")
      .eq("transaction_id", transactionId)
      .single();

    if (result.error || !result.data) {
      res.status(404).json({ error: "Pagamento não encontrado." });
    }

    // Aqui o TS *ainda* reclama? Força a não nulidade:
    res.json({ status: result.data!.status });
  } catch (err) {
    next(err);
  }
}
