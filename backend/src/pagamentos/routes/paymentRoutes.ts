// backend/src/pagamentos/routes/paymentRoutes.ts
import { Router } from "express";
import { getPaymentStatus } from "../controllers/statusController";

const router = Router();

// Agora o TS não reclama mais, porque getPaymentStatus tem a assinatura correta
router.get("/status/:transactionId", getPaymentStatus);

export default router;
