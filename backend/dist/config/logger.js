"use strict";
// backend/src/config/logger.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
function timestamp() {
    return new Date().toISOString();
}
function formatMessage(level, message) {
    return `[${timestamp()}] [${level.toUpperCase()}] ${message}`;
}
exports.logger = {
    debug: (msg) => {
        console.debug(formatMessage("debug", msg));
    },
    info: (msg) => {
        console.info(formatMessage("info", msg));
    },
    warn: (msg) => {
        console.warn(formatMessage("warn", msg));
    },
    error: (msg) => {
        console.error(formatMessage("error", msg));
    },
};
