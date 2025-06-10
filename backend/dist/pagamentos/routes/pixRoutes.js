"use strict";
// backend/src/pagamentos/routes/pixRoutes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pixValidator_1 = require("../validators/pixValidator");
const pixController_1 = require("../controllers/pixController");
const router = (0, express_1.Router)();
// Aqui o handler (createPixController) já tem assinatura compatível (Promise<void>).
router.post("/", pixValidator_1.pixValidator, pixController_1.createPixController);
exports.default = router;
