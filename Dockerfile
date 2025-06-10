# Build do frontend
FROM node:18-alpine as frontend-builder
WORKDIR /app
COPY frontend ./frontend
RUN cd frontend && yarn install && yarn build

# Build do backend
FROM node:18-alpine as backend-builder
WORKDIR /app
COPY backend ./backend
COPY --from=frontend-builder /app/frontend/dist ./backend/frontend/dist
WORKDIR /app/backend

# ⚠️ Instala com yarn, dá permissão no tsc e compila
RUN yarn install && chmod +x ./node_modules/.bin/tsc && yarn build

# Imagem final
FROM node:18-alpine
WORKDIR /app
COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist
COPY --from=backend-builder /app/backend/node_modules ./node_modules
COPY backend/package*.json ./
EXPOSE 3333
CMD ["node", "dist/server.js"]
