import { useState } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { FormError } from "../ui/FormError";
import { useForgotPassword } from "../../hooks/useForgotPassword.ts";
import { Link } from "react-router-dom";

function validateEmail(email: string) {
  if (!email.trim()) return "Email is required";
  if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) return "Enter a valid email";
  return undefined;
}

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { mutate, isPending, error } = useForgotPassword();

  const emailError = touched ? validateEmail(email) : undefined;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    if (validateEmail(email)) return;

    mutate(email, {
      onSuccess: () => setSubmitted(true),
    });
  };

  if (submitted) {
    return (
      <div className="space-y-5 text-center">
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-4 text-sm font-medium text-green-700">
          If an account exists, we’ve sent a reset link.
        </div>

        <Link
          to="/login"
          className="inline-block text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline"
        >
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      <FormError>
        {error ? "Something went wrong. Please try again." : undefined}
      </FormError>

      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => setTouched(true)}
        error={emailError}
        disabled={isPending}
        required
      />

      <Button
        type="submit"
        className="w-full"
        disabled={isPending || !!emailError}
      >
        {isPending ? "Sending..." : "Send Reset Link"}
      </Button>
    </form>
  );
}
