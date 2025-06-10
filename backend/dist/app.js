"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./config/env");
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
// Routers
const pixRoutes_1 = __importDefault(require("./pagamentos/routes/pixRoutes"));
const cardRoutes_1 = __importDefault(require("./pagamentos/routes/cardRoutes"));
const webhookRoutes_1 = __importDefault(require("./pagamentos/routes/webhookRoutes"));
const paymentRoutes_1 = __importDefault(require("./pagamentos/routes/paymentRoutes"));
const checkoutRoutes_1 = __importDefault(require("./pagamentos/checkout/checkoutRoutes"));
const app = (0, express_1.default)();
// CORS
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || "http://localhost:8080",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
// Middlewares
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.use((req, _res, next) => {
    console.log(`📣 [App] ${req.method} ${req.originalUrl} - Body:`, JSON.stringify(req.body));
    next();
});
// Rotas de pagamento
app.use("/pagamentos/pix", pixRoutes_1.default);
app.use("/pagamentos/card", cardRoutes_1.default);
app.use("/pagamentos/checkout", checkoutRoutes_1.default);
app.use("/pagamentos", webhookRoutes_1.default);
app.use("/pagamentos", paymentRoutes_1.default);
// Health check
app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
});
// Serve frontend em produção
const frontendPath = path_1.default.join(__dirname, "frontend/dist");
app.use(express_1.default.static(frontendPath));
// Só responde index.html se NÃO for rota de API
app.get(/^\/(?!pagamentos\/).*/, (_req, res) => {
    if (process.env.NODE_ENV === "production") {
        return res.sendFile(path_1.default.join(frontendPath, "index.html"), (err) => {
            if (err) {
                console.error("❌ Erro ao servir index.html:", err);
                res.status(500).send("Erro ao carregar o frontend");
            }
        });
    }
    res.status(404).json({ error: "Rota não encontrada" });
});
// Tratamento de erros
const errorHandler = (err, _req, res, _next) => {
    console.error("🛑 [App] Erro interno no servidor:", err);
    res.status(err.status || 500).json({
        error: err.message || "Erro interno no servidor",
    });
};
app.use(errorHandler);
exports.default = app;
