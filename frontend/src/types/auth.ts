export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  displayName: string;
  email: string;
}

export type ResetPasswordParams = {
  token: string;
  newPassword: string;
};

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  displayName: string;
  email: string;
  password: string;
}