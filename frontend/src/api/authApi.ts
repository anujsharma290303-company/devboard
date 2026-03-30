import { apiClient } from "../lib/apiClient";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  ResetPasswordParams,
  RefreshTokenResponse,
} from "../types/auth";

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  return apiClient<AuthResponse>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  return apiClient<AuthResponse>("/auth/register", {
    method: "POST",
    body: payload,
  });
}

export async function forgotPassword(email: string): Promise<void> {
  await apiClient("/auth/forgot-password", {
    method: "POST",
    body: { email },
  });
}

export async function resetPassword(
  params: ResetPasswordParams
): Promise<void> {
  const { token, newPassword } = params;

  await apiClient("/auth/reset-password", {
    method: "POST",
    body: {
      token,
      newPassword,
    },
  });
}

export async function refreshToken(
  refreshToken: string
): Promise<RefreshTokenResponse> {
  return apiClient<RefreshTokenResponse>("/auth/refresh-token", {
    method: "POST",
    body: { refreshToken },
  });
}