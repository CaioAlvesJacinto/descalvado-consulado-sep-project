# Etapa 1 - Build com permissões corretas
FROM node:18-alpine AS builder

# Instala ferramentas básicas
RUN apk add --no-cache bash

WORKDIR /app

# Copia e instala dependências com TypeScript
COPY package*.json tsconfig.json ./
RUN npm install

# Garante permissão de execução para o TypeScript
RUN chmod +x node_modules/.bin/tsc

COPY ./src ./src

# Compila com npx para evitar problema de permissão
RUN npx tsc

# Etapa 2 - Runtime
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/server.js"]