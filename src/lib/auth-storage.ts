import * as SecureStore from "expo-secure-store";

const ACCESS_KEY = "judify_access_token";
const REFRESH_KEY = "judify_refresh_token";

/** SecureStore só aceita string; nunca passe undefined/null/objeto. */
function asTokenString(value: unknown, field: string): string {
  if (typeof value === "string" && value.length > 0) {
    return value;
  }
  if (value == null || value === "") {
    throw new Error(
      `Resposta da API sem "${field}" (ou vazio). Confira se a base URL aponta para o Judify (/api/v1).`
    );
  }
  throw new Error(
    `O campo "${field}" precisa ser texto para o SecureStore. Tipo recebido: ${typeof value}.`
  );
}

/** Extrai tokens da resposta JSON (snake_case ou camelCase). */
export function parseAuthTokensPayload(raw: unknown): {
  access_token: string;
  refresh_token: string;
} {
  if (!raw || typeof raw !== "object") {
    throw new Error("Resposta de autenticação inválida (corpo vazio ou não é objeto).");
  }
  const o = raw as Record<string, unknown>;
  const access = o.access_token ?? o.accessToken;
  const refresh = o.refresh_token ?? o.refreshToken;
  return {
    access_token: asTokenString(access, "access_token"),
    refresh_token: asTokenString(refresh, "refresh_token"),
  };
}

export async function getAccessToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(ACCESS_KEY);
  } catch {
    return null;
  }
}

export async function getRefreshToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(REFRESH_KEY);
  } catch {
    return null;
  }
}

export async function setTokens(access: string, refresh: string): Promise<void> {
  const a = asTokenString(access, "access_token");
  const r = asTokenString(refresh, "refresh_token");
  await SecureStore.setItemAsync(ACCESS_KEY, a);
  await SecureStore.setItemAsync(REFRESH_KEY, r);
}

export async function setAccessToken(access: string): Promise<void> {
  await SecureStore.setItemAsync(ACCESS_KEY, asTokenString(access, "access_token"));
}

export async function clearTokens(): Promise<void> {
  await SecureStore.deleteItemAsync(ACCESS_KEY);
  await SecureStore.deleteItemAsync(REFRESH_KEY);
}
