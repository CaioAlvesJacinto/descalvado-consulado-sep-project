"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
// Cria servidor HTTP a partir da instância do Express
const server = http_1.default.createServer(app_1.default);
// Captura de erros não tratados
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    process.exit(1);
});
process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection:", reason);
    process.exit(1);
});
// Inicia o servidor
server.listen(env_1.APP_PORT, () => {
    console.log(`Servidor rodando na porta ${env_1.APP_PORT}`);
});
