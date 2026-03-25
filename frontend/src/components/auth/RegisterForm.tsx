import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { FormError } from "../ui/FormError";
import { useRegister } from "../../hooks/useRegister";

export function RegisterForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    displayName: "",
    email: "",
    password: "",
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const {
    mutate: register,
    isPending,
    error,
  } = useRegister();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!form.displayName.trim()) errors.displayName = "Name is required";
    if (!form.email.trim()) errors.email = "Email is required";
    if (!form.password.trim()) errors.password = "Password is required";
    return errors;
  };

  const errors = validate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (Object.keys(errors).length > 0) {
      setTouched({ displayName: true, email: true, password: true });
      return;
    }

    register(
      {
        displayName: form.displayName,
        email: form.email,
        password: form.password,
      },
      {
        onSuccess: () => {
          navigate("/login", { replace: true });
        },
        onError: (err: Error) => {
          setFormError(err.message || "Registration failed");
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
        label="Name"
        name="displayName"
        type="text"
        autoComplete="name"
        value={form.displayName}
        onChange={handleChange}
        onBlur={handleBlur}
        error={
          touched.displayName && errors.displayName
            ? errors.displayName
            : undefined
        }
        disabled={isPending}
        required
      />

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
        autoComplete="new-password"
        value={form.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.password && errors.password ? errors.password : undefined}
        disabled={isPending}
        required
      />

      <Button
        type="submit"
        loading={isPending}
        disabled={isPending}
        className="mt-2 w-full"
      >
        Register
      </Button>
    </form>
  );
}
