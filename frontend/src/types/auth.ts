export interface User {
	id: string;
	displayName: string;
	email: string;
}

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
