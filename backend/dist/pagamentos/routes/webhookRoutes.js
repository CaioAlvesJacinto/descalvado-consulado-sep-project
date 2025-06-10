"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/pagamentos/routes/webhookRoutes.ts
const express_1 = require("express");
const webhookController_1 = require("../controllers/webhookController");
const router = (0, express_1.Router)();
router.post("/webhook", webhookController_1.webhookController);
exports.default = router;
