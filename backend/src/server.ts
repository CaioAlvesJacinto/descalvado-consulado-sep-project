import http from "http";
import app from "./app";
import { APP_PORT } from "./config/env";

// Railway/Render SEMPRE usa process.env.PORT (já tratado em APP_PORT)
const server = http.createServer(app);

// Captura de erros não tratados
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
  process.exit(1);
});

server.listen(APP_PORT, () => {
  console.log(`Servidor rodando na porta ${APP_PORT}`);
});
