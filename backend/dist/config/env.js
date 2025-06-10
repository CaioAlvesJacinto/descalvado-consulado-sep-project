"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NODE_ENV = exports.APP_PORT = exports.SUPABASE_SERVICE_KEY = exports.SUPABASE_URL = exports.MP_NOTIFICATION_URL = exports.MP_PUBLIC_KEY = exports.MP_ACCESS_TOKEN = exports.MP_BASE_URL = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Garante o carregamento do .env apenas em desenvolvimento/local
if (process.env.NODE_ENV !== "production") {
    dotenv_1.default.config({
        path: path_1.default.resolve(__dirname, "../../.env"),
    });
}
/**
 * Garante que uma variável obrigatória exista;
 * caso contrário, lança erro ao iniciar a aplicação.
 */
function getEnvVar(key) {
    const value = process.env[key];
    if (!value) {
        throw new Error(`A variável de ambiente ${key} não está definida.`);
    }
    return value;
}
/** Mercado Pago */
exports.MP_BASE_URL = process.env.MERCADO_PAGO_BASE_URL || "https://api.mercadopago.com";
exports.MP_ACCESS_TOKEN = getEnvVar("MP_ACCESS_TOKEN");
exports.MP_PUBLIC_KEY = getEnvVar("MERCADO_PAGO_PUBLIC_KEY");
exports.MP_NOTIFICATION_URL = process.env.MP_NOTIFICATION_URL || "";
/** Supabase */
exports.SUPABASE_URL = getEnvVar("SUPABASE_URL");
exports.SUPABASE_SERVICE_KEY = getEnvVar("SUPABASE_SERVICE_KEY");
/** Server */
exports.APP_PORT = process.env.PORT ? Number(process.env.PORT) : 3333;
exports.NODE_ENV = process.env.NODE_ENV || "development";
