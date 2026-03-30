import { createContext } from "react";
import type { User, AuthResponse } from "../types/auth";

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  login: (auth: AuthResponse) => void;
  logout: () => void;
  refreshSession: () => Promise<string | null>;
}

export const AuthContext = createContext<AuthState | undefined>(undefined);