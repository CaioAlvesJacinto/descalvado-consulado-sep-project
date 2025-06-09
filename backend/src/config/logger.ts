// backend/src/config/logger.ts

// Um wrapper mínimo que formata timestamp e nivel de log
export type LogLevel = "debug" | "info" | "warn" | "error";

function timestamp(): string {
  return new Date().toISOString();
}

function formatMessage(level: LogLevel, message: string): string {
  return `[${timestamp()}] [${level.toUpperCase()}] ${message}`;
}

export const logger = {
  debug: (msg: string) => {
    console.debug(formatMessage("debug", msg));
  },
  info: (msg: string) => {
    console.info(formatMessage("info", msg));
  },
  warn: (msg: string) => {
    console.warn(formatMessage("warn", msg));
  },
  error: (msg: string) => {
    console.error(formatMessage("error", msg));
  },
};
