import { useMutation } from "@tanstack/react-query";
import { login } from "../api/authApi";
import type { LoginPayload, AuthResponse } from "../types/auth";

export function useLogin() {
	return useMutation<AuthResponse, Error, LoginPayload>({
		mutationFn: login,
		onError: (error) => {
			// Optionally log or report error
		},
	});
}
