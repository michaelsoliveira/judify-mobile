import type { RefreshResponse } from "@/types/api";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "@/lib/auth-storage";
import { API_BASE_URL } from "@/lib/config";

type FetchOptions = RequestInit & { _retry?: boolean };

function toRequestInit(options: FetchOptions): RequestInit {
  const { _retry: _r, ...rest } = options;
  return rest;
}

let refreshInFlight: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    const refresh = await getRefreshToken();
    if (!refresh) return null;

    const res = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: { Authorization: `Bearer ${refresh}` },
    });

    if (!res.ok) {
      await clearTokens();
      return null;
    }

    const data = (await res.json()) as RefreshResponse;
    await setTokens(data.access_token, data.refresh_token);
    return data.access_token;
  })();

  try {
    return await refreshInFlight;
  } finally {
    refreshInFlight = null;
  }
}

/** Chamada autenticada. Em 401, tenta refresh e repete uma vez. */
export async function apiFetch(
  path: string,
  options: FetchOptions = {}
): Promise<Response> {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  const access = await getAccessToken();

  const headers = new Headers(options.headers);
  if (access && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${access}`);
  }
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  let res = await fetch(url, { ...toRequestInit(options), headers });

  if (res.status === 401 && !options._retry) {
    const newAccess = await refreshAccessToken();
    if (newAccess) {
      headers.set("Authorization", `Bearer ${newAccess}`);
      res = await fetch(url, {
        ...toRequestInit({ ...options, _retry: true }),
        headers,
      });
    }
  }

  return res;
}

export async function apiJson<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const res = await apiFetch(path, options);
  if (!res.ok) {
    let detail: string = res.statusText;
    try {
      const body = await res.json();
      if (body && typeof body.detail === "string") detail = body.detail;
      else if (body && typeof body.message === "string") detail = body.message;
    } catch {
      /* ignore */
    }
    const err = new Error(detail) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }
  return res.json() as Promise<T>;
}
