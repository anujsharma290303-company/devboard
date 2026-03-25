import { useMutation } from "@tanstack/react-query";
import { register } from "../api/authApi";
import type { RegisterPayload, AuthResponse } from "../types/auth";

export function useRegister() {
  return useMutation<AuthResponse, Error, RegisterPayload>({
    mutationFn: register,
    onError: (error) => {
      // Optionally log or report error
    },
  });
}
