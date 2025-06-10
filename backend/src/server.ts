import http from "http";
import app from "./app";

// Usa a porta dinâmica para compatibilidade com Railway e Render
const PORT = process.env.PORT || 3333;

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

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
