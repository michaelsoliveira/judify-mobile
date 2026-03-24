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
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), password }),
    });

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
