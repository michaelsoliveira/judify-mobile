# Judify Mobile

App Expo (React Native) para o backend Judify (FastAPI): login com JWT, armazenamento seguro dos tokens, refresh automático em 401 e telas de resumo, tarefas e perfil.

## Configuração

1. Copie `.env.example` para `.env` e defina a URL da API (com `/api/v1`):

   ```bash
   cp .env.example .env
   ```

   Em dispositivo físico ou emulador, use o IP da máquina onde o backend roda (não use `localhost` no aparelho).

2. Instale dependências e inicie:

   ```bash
   npm install
   npx expo start
   ```

## Rotas da API utilizadas

- `POST /auth/login`, `POST /auth/refresh-token`, `POST /auth/logout`
- `GET /users/me`
- `GET /tarefas/minhas-tarefas`, `GET /tarefas/{id}`, `GET /tarefas/dashboard/estatisticas`
