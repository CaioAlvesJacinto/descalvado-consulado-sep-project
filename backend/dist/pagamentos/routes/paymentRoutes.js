"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/pagamentos/routes/paymentRoutes.ts
const express_1 = require("express");
const statusController_1 = require("../controllers/statusController");
const router = (0, express_1.Router)();
// Agora o TS não reclama mais, porque getPaymentStatus tem a assinatura correta
router.get("/status/:transactionId", statusController_1.getPaymentStatus);
exports.default = router;
