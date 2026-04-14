import { apiFetch, apiJson } from "@/lib/api";
import { API_BASE_URL } from "@/lib/config";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "@/lib/auth-storage";
import type { LoginResponse, UserPublic } from "@/types/api";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type AuthContextValue = {
  user: UserPublic | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserPublic | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const access = await getAccessToken();
    if (!access) {
      setUser(null);
      return;
    }
    try {
      const me = await apiJson<UserPublic>("/users/me");
      setUser(me);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const access = await getAccessToken();
      const refresh = await getRefreshToken();
      if (!access || !refresh) {
        if (!cancelled) {
          setUser(null);
          setIsLoading(false);
        }
        return;
      }
      try {
        const me = await apiJson<UserPublic>("/users/me");
        if (!cancelled) setUser(me);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    let res: Response;
    try {
      res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
    } catch {
      const hint =
        API_BASE_URL.includes("localhost") || API_BASE_URL.includes("127.0.0.1")
          ? " Em celular físico use o IP da máquina em EXPO_PUBLIC_API_URL (ex.: http://192.168.x.x:8000/api/v1); no emulador Android use 10.0.2.2 no lugar de localhost."
          : " Verifique se o backend está no ar e se a URL em EXPO_PUBLIC_API_URL inclui /api/v1.";
      throw new Error(
        `Não foi possível conectar à API (${API_BASE_URL}).${hint}`
      );
    }

    if (res.status === 402) {
      const body = await res.json().catch(() => ({}));
      const msg =
        typeof body.detail === "string"
          ? body.detail
          : "Pagamento pendente ou assinatura suspensa.";
      throw new Error(msg);
    }

    if (!res.ok) {
      let detail = "Credenciais inválidas.";
      try {
        const body = await res.json();
        console.log("Login error response body:", body);
        if (typeof body.detail === "string") detail = body.detail;
      } catch {
        /* ignore */
      }
      throw new Error(detail);
    }

    const data = (await res.json()) as LoginResponse;
    await setTokens(data.access_token, data.refresh_token);
    try {
      const me = await apiJson<UserPublic>("/users/me");
      setUser(me);
    } catch {
      setUser(data.user);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      const access = await getAccessToken();
      if (access) {
        await apiFetch("/auth/logout", { method: "POST" });
      }
    } catch {
      /* ignore */
    }
    await clearTokens();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      signIn,
      signOut,
      refreshUser,
    }),
    [user, isLoading, signIn, signOut, refreshUser]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
