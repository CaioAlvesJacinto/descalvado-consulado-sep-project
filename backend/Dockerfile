# Etapa de build
FROM node:18-alpine AS builder

WORKDIR /app

# Instala dependências do sistema (bash opcional)
RUN apk add --no-cache bash

# Copia os arquivos de dependência
COPY backend/package*.json ./
COPY backend/tsconfig.json ./

# Instala dependências de desenvolvimento
RUN npm install

# Copia o restante do código
COPY backend/src ./src

# Compila usando npx para evitar problema de permissão
RUN npx tsc

# Etapa de produção
FROM node:18-alpine

WORKDIR /app

# Copia apenas o necessário para produção
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Expõe a porta
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "dist/server.js"]