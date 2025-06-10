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
RUN yarn install && chmod +x ./node_modules/.bin/tsc && yarn build

# Imagem final (roda backend + frontend juntos)
FROM node:18-alpine
WORKDIR /app

# Copia backend compilado
COPY --from=backend-builder /app/backend/dist ./dist
# Copia frontend buildado (usado via Express)
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist
# Copia node_modules já prontos
COPY --from=backend-builder /app/backend/node_modules ./node_modules
# Copia package.json (opcional aqui, pois já temos node_modules)
COPY backend/package*.json ./

# Expõe só a porta 3333 (backend serve tudo, inclusive o front)
EXPOSE 3333

CMD ["node", "dist/server.js"]
