# Etapa de build
FROM node:18-alpine AS builder

WORKDIR /app

RUN apk add --no-cache bash

# Copia apenas os arquivos necessários
COPY backend/package*.json ./
COPY backend/tsconfig.json ./
COPY backend/src ./src

RUN npm install
RUN chmod +x ./node_modules/.bin/tsc

RUN npx tsc

# Etapa de produção
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3333
CMD ["node", "dist/server.js"]
