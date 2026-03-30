import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../api/authApi";
import type { ResetPasswordParams } from "../types/auth";

export function useResetPassword() {
  return useMutation<void, Error, ResetPasswordParams>({
    mutationFn: resetPassword,
  });
}
