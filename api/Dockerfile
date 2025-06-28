# Stage 1: build
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# 1) Instalar dependências antes de copiar todo o código
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# 2) Copiar o restante
COPY . .

# 3) Build da aplicação
RUN yarn build

# Stage 2: runtime
FROM node:20-alpine
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY .env .env

EXPOSE 3000
CMD ["sh", "-c", "node dist/main.js | pino-pretty"]
