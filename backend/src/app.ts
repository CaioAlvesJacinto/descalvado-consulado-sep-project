import './config/env';
import cors from "cors";
import morgan from "morgan";
import express, {
  Application,
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from "express";
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
  console.log(
    `📣 [App] ${req.method} ${req.originalUrl} - Body:`,
    JSON.stringify(req.body)
  );
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

// Serve frontend em produção
const frontendPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendPath));

// Só responde index.html se NÃO for rota de API
app.get(/^\/(?!pagamentos\/).*/, (_req: Request, res: Response) => {
  if (process.env.NODE_ENV === "production") {
    try {
      return res.sendFile(path.join(frontendPath, "index.html"));
    } catch (err) {
      console.warn("⚠️ index.html não encontrado.");
    }
  }
  res.status(404).json({ error: "Rota não encontrada" });
});

// Tratamento de erros
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error("🛑 [App] Erro interno no servidor:", err);
  res.status((err.status as number) || 500).json({
    error: err.message || "Erro interno no servidor",
  });
};
app.use(errorHandler);

export default app;
