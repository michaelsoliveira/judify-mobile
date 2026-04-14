/** Base URL da API Judify: deve incluir o prefixo `/api/v1` e **sem** barra no final. */
import Constants from "expo-constants";

function normalizeBaseUrl(raw: string | undefined): string {
  const v = (raw ?? "").trim().replace(/\/$/, "");
  if (!v) {
    return "http://localhost:8000/api/v1";
  }
  return v;
}

/**
 * Ordem: `EXPO_PUBLIC_API_URL` (.env) → `expo.extra.API_BASE_URL` (app.json) → localhost.
 * Em celular físico ou emulador Android, use o IP da máquina (não `localhost`).
 */
export const API_BASE_URL = normalizeBaseUrl(
  process.env.EXPO_PUBLIC_API_URL ?? Constants.expoConfig?.extra?.API_BASE_URL
);

if (__DEV__ && !API_BASE_URL.includes("/api/v1")) {
  console.warn(
    "[judify-mobile] API_BASE_URL deve incluir /api/v1 (ex.: http://192.168.0.10:8000/api/v1). Atual:",
    API_BASE_URL
  );
}
