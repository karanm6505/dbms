import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { authApi, type LoginPayload } from "../api/auth";
import { apiClient } from "../api/client";
import { type AuthUser } from "../types";

const TOKEN_STORAGE_KEY = "library.auth.token";

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const applyToken = useCallback((value: string | null) => {
    setToken(value);

    if (value) {
      localStorage.setItem(TOKEN_STORAGE_KEY, value);
      apiClient.setAuthTokenProvider(() => value);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      apiClient.setAuthTokenProvider(null);
    }
  }, []);

  const refresh = useCallback(async () => {
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const currentUser = await authApi.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      console.error("Failed to refresh current user", err);
      applyToken(null);
      setUser(null);
      throw err;
    }
  }, [token, applyToken]);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

    if (!storedToken) {
      apiClient.setAuthTokenProvider(null);
      setLoading(false);
      return;
    }

    applyToken(storedToken);

    authApi
      .getCurrentUser()
      .then((currentUser) => {
        setUser(currentUser);
      })
      .catch((err) => {
        console.warn("Stored token is no longer valid", err);
        applyToken(null);
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [applyToken]);

  const login = useCallback(
    async (payload: LoginPayload) => {
      setError(null);
      setLoading(true);

      try {
        const result = await authApi.login(payload);
        applyToken(result.token);
        setUser(result.user);
      } catch (err) {
        applyToken(null);
        setUser(null);
        const message =
          err instanceof Error ? err.message : "Unable to sign in. Try again.";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [applyToken]
  );

  const logout = useCallback(() => {
    applyToken(null);
    setUser(null);
    setError(null);
  }, [applyToken]);

  useEffect(() => {
    return () => {
      apiClient.setAuthTokenProvider(null);
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user && token),
      isAdmin: user?.role === "admin",
      loading,
      error,
      login,
      logout,
      refresh,
    }),
    [user, token, loading, error, login, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
