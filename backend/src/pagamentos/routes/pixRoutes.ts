// backend/src/pagamentos/routes/pixRoutes.ts

import { Router } from "express";
import { pixValidator } from "../validators/pixValidator";
import { createPixController } from "../controllers/pixController";

const router = Router();

// Aqui o handler (createPixController) já tem assinatura compatível (Promise<void>).
router.post("/", pixValidator, createPixController);

export default router;
