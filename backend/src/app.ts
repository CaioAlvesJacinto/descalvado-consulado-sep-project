import './config/env';
import cors from "cors";
import morgan from "morgan";
import express, { Request, Response, NextFunction } from "express";


import pixRouter from "./pagamentos/routes/pixRoutes";
import cardRouter from "./pagamentos/routes/cardRoutes";
import webhookRoutes from "./pagamentos/routes/webhookRoutes";
import paymentRoutes from "./pagamentos/routes/paymentRoutes"; // ⬅️ novo
import checkoutRoutes from "./pagamentos/checkout/checkoutRoutes"; // ✅ NOVO


const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:8080",
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"]
}));

app.use(express.json());

app.use((req, _res, next) => {
  console.log(`📣 [App] ${req.method} ${req.originalUrl} - Body:`, JSON.stringify(req.body));
  next();
});

app.use(morgan("dev"));

// Rotas de pagamento
app.use("/pagamentos/pix", pixRouter);
app.use("/pagamentos/card", cardRouter);
app.use("/pagamentos/checkout", checkoutRoutes); // ✅ NOVO
app.use("/pagamentos", webhookRoutes);
app.use("/pagamentos", paymentRoutes); // ✅ adiciona aqui

// Health Check
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// Tratamento de erro
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("🛑 [App] Erro interno no servidor:", err);
  res.status(err.status || 500).json({
    error: err.message || "Erro interno no servidor",
  });
});

export default app;
