# Judify Mobile

App Expo (React Native) para o backend Judify (FastAPI): login com JWT, armazenamento seguro dos tokens, refresh automático em 401 e telas de resumo, tarefas e perfil.

## Configuração

1. Copie `.env.example` para `.env` e defina a URL da API (**obrigatório** incluir `/api/v1`):

   ```bash
   cp .env.example .env
   ```

   Exemplo: `EXPO_PUBLIC_API_URL=http://192.168.1.10:8000/api/v1`

   | Onde roda o app | URL típica |
   |-----------------|------------|
   | Simulador iOS (Mac) | `http://localhost:8000/api/v1` |
   | Emulador Android | `http://10.0.2.2:8000/api/v1` (mapeia para o host) |
   | Celular físico (mesma rede Wi‑Fi) | `http://<IP-da-sua-máquina>:8000/api/v1` |

   O backend precisa escutar em `0.0.0.0` (não só `127.0.0.1`) para o celular alcançar o IP da máquina.

   Depois de alterar `.env`, reinicie o bundler (`npx expo start -c`).

2. Instale dependências e inicie:

   ```bash
   npm install
   npx expo start
   ```

## Rotas da API utilizadas

- `POST /auth/login`, `POST /auth/refresh-token`, `POST /auth/logout`
- `GET /users/me`
- `GET /tarefas/minhas-tarefas`, `GET /tarefas/{id}`, `GET /tarefas/dashboard/estatisticas`
