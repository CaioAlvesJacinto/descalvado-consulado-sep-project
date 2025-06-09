// backend/src/pagamentos/routes/checkoutRoutes.ts

import { Router } from "express";
import { createPreferenceController } from "./checkoutController";

const router = Router();

router.post("/preference", createPreferenceController);

export default router;
