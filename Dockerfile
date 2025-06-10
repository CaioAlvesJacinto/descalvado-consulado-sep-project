# Build do frontend
FROM node:18-alpine as frontend-builder
WORKDIR /app
COPY frontend ./frontend
RUN cd frontend && npm install && npm run build

# Build do backend
FROM node:18-alpine as backend-builder
WORKDIR /app
COPY backend ./backend
COPY --from=frontend-builder /app/frontend/dist ./backend/frontend/dist
WORKDIR /app/backend

# ⚠️ Mova o chmod para depois do npm install
RUN npm install && chmod +x ./node_modules/.bin/tsc && npm run build

# Imagem final
FROM node:18-alpine
WORKDIR /app
COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist
COPY backend/package*.json ./
RUN npm install --production
EXPOSE 3333
CMD ["node", "dist/server.js"]
