import { useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { AuthResponse, User } from "../types/auth";
import { queryClient } from "../lib/queryClient";
import { refreshToken as refreshTokenApi } from "../api/authApi";
import {
  getStoredSession,
  saveStoredSession,
  clearStoredSession,
} from "./authSession";
import { AuthContext } from "./auth-context";

type AuthBootstrapState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
};

function getInitialAuthState(): AuthBootstrapState {
  const session = getStoredSession();

  if (!session) {
    return {
      user: null,
      accessToken: null,
      refreshToken: null,
    };
  }

  return {
    user: session.user,
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthBootstrapState>(
    getInitialAuthState
  );

  const login = useCallback((auth: AuthResponse) => {
    if (!auth.accessToken || !auth.refreshToken || !auth.user) {
      throw new Error("Invalid auth response");
    }

    const session = {
      user: auth.user,
      accessToken: auth.accessToken,
      refreshToken: auth.refreshToken,
    };

    setAuthState(session);
    saveStoredSession(session);
  }, []);

  const logout = useCallback(() => {
    setAuthState({
      user: null,
      accessToken: null,
      refreshToken: null,
    });

    clearStoredSession();
    queryClient.clear();
    window.location.href = "/login";
  }, []);

  const isAuthenticated = !!authState.user && !!authState.accessToken;
  const isAuthReady = true;

  const refreshSession = useCallback(async (): Promise<string | null> => {
    const currentRefreshToken = authState.refreshToken;
    const currentUser = authState.user;

    if (!currentRefreshToken || !currentUser) return null;

    try {
      const res = await refreshTokenApi(currentRefreshToken);

      const session = {
        user: currentUser,
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
      };

      setAuthState(session);
      saveStoredSession(session);

      return res.accessToken;
    } catch {
      setAuthState({
        user: null,
        accessToken: null,
        refreshToken: null,
      });

      clearStoredSession();
      queryClient.clear();

      return null;
    }
  }, [authState.refreshToken, authState.user]);

  const value = useMemo(
    () => ({
      user: authState.user,
      accessToken: authState.accessToken,
      refreshToken: authState.refreshToken,
      isAuthenticated,
      isAuthReady,
      login,
      logout,
      refreshSession,
    }),
    [
      authState,
      isAuthenticated,
      isAuthReady,
      login,
      logout,
      refreshSession,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}