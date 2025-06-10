import dotenv from "dotenv";
import path from "path";

// Garante o carregamento do .env apenas em desenvolvimento/local
if (process.env.NODE_ENV !== "production") {
  dotenv.config({
    path: path.resolve(__dirname, "../../.env"),
  });
}

/**
 * Garante que uma variável obrigatória exista; 
 * caso contrário, lança erro ao iniciar a aplicação.
 */
function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`A variável de ambiente ${key} não está definida.`);
  }
  return value;
}

/** Mercado Pago */
export const MP_BASE_URL = process.env.MERCADO_PAGO_BASE_URL || "https://api.mercadopago.com";
export const MP_ACCESS_TOKEN = getEnvVar("MP_ACCESS_TOKEN");
export const MP_PUBLIC_KEY = getEnvVar("MERCADO_PAGO_PUBLIC_KEY");
export const MP_NOTIFICATION_URL = process.env.MP_NOTIFICATION_URL || "";

/** Supabase */
export const SUPABASE_URL = getEnvVar("SUPABASE_URL");
export const SUPABASE_SERVICE_KEY = getEnvVar("SUPABASE_SERVICE_KEY");

/** Server */
export const APP_PORT = process.env.PORT ? Number(process.env.PORT) : 3333;
export const NODE_ENV = process.env.NODE_ENV || "development";
