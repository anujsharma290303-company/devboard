import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { FormError } from "../ui/FormError.tsx";
import { useLogin } from "../../hooks/useLogin";
import { useAuth } from "../../context/useAuth";

export function LoginForm() {
  const { login: setSession } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const {
    mutate: login,
    isPending,
    error,
  } = useLogin();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!form.email.trim()) errors.email = "Email is required";
    if (!form.password.trim()) errors.password = "Password is required";
    return errors;
  };

  const errors = validate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (Object.keys(errors).length > 0) {
      setTouched({ email: true, password: true });
      return;
    }

    login(
      { email: form.email, password: form.password },
      {
        onSuccess: (data) => {
          setSession(data);
        },
        onError: (err: Error) => {
          setFormError(err.message || "Login failed");
        },
      }
    );
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      <FormError>
        {formError || (error instanceof Error ? error.message : undefined)}
      </FormError>

      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        value={form.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.email && errors.email ? errors.email : undefined}
        disabled={isPending}
        required
      />

      <Input
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        value={form.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.password && errors.password ? errors.password : undefined}
        disabled={isPending}
        required
      />

      <div className="flex justify-end -mt-2">
        <Link
          to="/forgot-password"
          className="text-sm font-medium text-primary-light transition-colors hover:text-[#c996ff] hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        loading={isPending}
        disabled={isPending}
        className="mt-2 w-full"
      >
        Sign In
      </Button>
    </form>
  );
}