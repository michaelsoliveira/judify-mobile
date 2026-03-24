/** Base URL da API (ex.: http://192.168.0.5:8000/api/v1), sem barra final. */
export const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8000/api/v1"
).replace(/\/$/, "");
