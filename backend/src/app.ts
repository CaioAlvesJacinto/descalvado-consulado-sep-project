import './config/env';
import cors from "cors";
import morgan from "morgan";
import express, { Application, Request, Response, NextFunction, ErrorRequestHandler } from "express";
import path from "path";

// Routers
import pixRouter from "./pagamentos/routes/pixRoutes";
import cardRouter from "./pagamentos/routes/cardRoutes";
import webhookRoutes from "./pagamentos/routes/webhookRoutes";
import paymentRoutes from "./pagamentos/routes/paymentRoutes";
import checkoutRoutes from "./pagamentos/checkout/checkoutRoutes";

const app: Application = express();

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:8080",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`📣 [App] ${req.method} ${req.originalUrl} - Body:`, JSON.stringify(req.body));
  next();
});

// Rotas de pagamento
app.use("/pagamentos/pix", pixRouter);
app.use("/pagamentos/card", cardRouter);
app.use("/pagamentos/checkout", checkoutRoutes);
app.use("/pagamentos", webhookRoutes);
app.use("/pagamentos", paymentRoutes);

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

// Serve frontend se estiver em produção
if (process.env.NODE_ENV === "production") {
  console.log("🟢 Servindo frontend em modo produção");
  const frontendPath = path.join(__dirname, "..", "frontend", "dist");
  console.log("📁 Caminho do frontend:", frontendPath);
  app.use(express.static(frontendPath));

  app.get(/^\/(?!pagamentos\/).*/, (_req: Request, res: Response) => {
    console.log("➡️ Rota frontend capturada (SPA)");
    res.sendFile(path.join(frontendPath, "index.html"), (err) => {
      if (err) {
        console.error("❌ Erro ao servir index.html:", err);
        res.status(500).send("Erro ao carregar o frontend");
      }
    });
  });
} else {
  console.log("🟡 Modo DEV: não servindo frontend");
  app.get(/^\/(?!pagamentos\/).*/, (_req: Request, res: Response) => {
    res.status(404).json({ error: "Rota não encontrada (modo dev)" });
  });
}


// Tratamento de erros
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error("🛑 [App] Erro interno no servidor:", err);
  res.status((err.status as number) || 500).json({
    error: err.message || "Erro interno no servidor",
  });
};
app.use(errorHandler);

export default app;
