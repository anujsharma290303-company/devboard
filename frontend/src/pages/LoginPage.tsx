import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/layout/AuthLayout";
import { LoginForm } from "../components/auth/LoginForm";
import { useAuth } from "../context/useAuth";

export default function LoginPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/boards", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <AuthLayout title="Sign in to DevBoard" subtitle="Welcome back!">
      <LoginForm />

      <div className="mt-10 text-center text-sm text-slate-300">
        Don&apos;t have an account?{" "}
        <Link
          to="/register"
          className="font-medium text-blue-600 hover:text-blue-700 underline-offset-2 hover:underline transition-colors"
        >
          Register
        </Link>
      </div>
    </AuthLayout>
  );
}