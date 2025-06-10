# Etapa de build
FROM node:18-alpine AS builder

WORKDIR /app

# Instala dependências do sistema
RUN apk add --no-cache bash

# Copia todo o conteúdo da pasta backend
COPY backend/ ./

# Instala dependências
RUN npm install

# Compila
RUN npx tsc

# Etapa de produção
FROM node:18-alpine

WORKDIR /app

# Copia artefatos de produção
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3333

CMD ["node", "dist/server.js"]
