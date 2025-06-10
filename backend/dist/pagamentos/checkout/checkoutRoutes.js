"use strict";
// backend/src/pagamentos/routes/checkoutRoutes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const checkoutController_1 = require("./checkoutController");
const router = (0, express_1.Router)();
router.post("/preference", checkoutController_1.createPreferenceController);
exports.default = router;
