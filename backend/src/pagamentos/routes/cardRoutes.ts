// backend/src/pagamentos/routes/cardRoutes.ts

import { Router } from "express";
import { cardValidator } from "../validators/cardValidator";
import { createCardController } from "../controllers/cardController";

const router = Router();

// POST /pagamentos/card
router.post("/", cardValidator, createCardController);

export default router;
