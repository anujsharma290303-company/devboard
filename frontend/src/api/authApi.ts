import { apiClient } from "../lib/apiClient";
import type { AuthResponse, LoginPayload, RegisterPayload } from "../types/auth";

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
