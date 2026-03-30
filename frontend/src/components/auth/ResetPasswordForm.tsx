import { useState } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { FormError } from "../ui/FormError";
import { useResetPassword } from "../../hooks/useResetPassword.ts";
import { Link } from "react-router-dom";

type Props = {
  token: string;
};

export function ResetPasswordForm({ token }: Props) {
  const [fields, setFields] = useState({
    password: "",
    confirm: "",
  });

  const [touched, setTouched] = useState({
    password: false,
    confirm: false,
  });

  const [submitted, setSubmitted] = useState(false);

  const { mutate, isPending, error } = useResetPassword();

  const passwordError =
    touched.password && !fields.password
      ? "Password is required"
      : touched.password && fields.password.length < 8
      ? "Password must be at least 8 characters"
      : undefined;

  const confirmError =
    touched.confirm && !fields.confirm
      ? "Please confirm your password"
      : touched.confirm && fields.confirm !== fields.password
      ? "Passwords do not match"
      : undefined;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched((prev) => ({
      ...prev,
      [e.target.name]: true,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      password: true,
      confirm: true,
    });

    const nextPasswordError =
      !fields.password
        ? "Password is required"
        : fields.password.length < 8
        ? "Password must be at least 8 characters"
        : undefined;

    const nextConfirmError =
      !fields.confirm
        ? "Please confirm your password"
        : fields.confirm !== fields.password
        ? "Passwords do not match"
        : undefined;

    if (nextPasswordError || nextConfirmError) return;

    mutate(
      {
        token,
        newPassword: fields.password,
      },
      {
        onSuccess: () => setSubmitted(true),
      }
    );
  };

  if (submitted) {
    return (
      <div className="space-y-5 text-center">
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-4 text-sm font-medium text-green-700">
          Password reset successful!
        </div>

        <Link
          to="/login"
          className="inline-block text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline"
        >
          Return to login
        </Link>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      <FormError>{error?.message}</FormError>

      <Input
        label="New Password"
        name="password"
        type="password"
        autoComplete="new-password"
        value={fields.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={passwordError}
        disabled={isPending}
        required
      />

      <Input
        label="Confirm Password"
        name="confirm"
        type="password"
        autoComplete="new-password"
        value={fields.confirm}
        onChange={handleChange}
        onBlur={handleBlur}
        error={confirmError}
        disabled={isPending}
        required
      />

      <Button
        type="submit"
        className="w-full"
        disabled={isPending || !!passwordError || !!confirmError}
      >
        {isPending ? "Resetting..." : "Reset Password"}
      </Button>
    </form>
  );
}
