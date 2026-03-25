import { useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { User, AuthResponse } from "../types/auth";
import { getStoredSession, STORAGE_KEY } from "./authSession";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const session = getStoredSession();
    return session ? session.user : null;
  });

  const [accessToken, setAccessToken] = useState<string | null>(() => {
    const session = getStoredSession();
    return session ? session.accessToken : null;
  });

  const [refreshToken, setRefreshToken] = useState<string | null>(() => {
    const session = getStoredSession();
    return session ? session.refreshToken : null;
  });

  const login = useCallback((auth: AuthResponse) => {
    setUser(auth.user);
    setAccessToken(auth.accessToken);
    setRefreshToken(auth.refreshToken);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        user: auth.user,
        accessToken: auth.accessToken,
        refreshToken: auth.refreshToken,
      })
    );
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const isAuthenticated = !!user && !!accessToken;

  const value = useMemo(
    () => ({
      user,
      accessToken,
      refreshToken,
      isAuthenticated,
      login,
      logout,
    }),
    [user, accessToken, refreshToken, isAuthenticated, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}