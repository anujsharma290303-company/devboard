export interface User {
	id: string;
	displayName: string;
	email: string;
}

export interface AuthResponse {
	token: string;
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
