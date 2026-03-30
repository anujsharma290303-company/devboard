import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "../api/authApi";

export function useForgotPassword() {
  return useMutation<void, Error, string>({
    mutationFn: forgotPassword,
  });
}
