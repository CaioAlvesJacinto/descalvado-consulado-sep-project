"use strict";
// backend/src/pagamentos/routes/cardRoutes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cardValidator_1 = require("../validators/cardValidator");
const cardController_1 = require("../controllers/cardController");
const router = (0, express_1.Router)();
// POST /pagamentos/card
router.post("/", cardValidator_1.cardValidator, cardController_1.createCardController);
exports.default = router;
