import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/layout/AuthLayout";
import { RegisterForm } from "../components/auth/RegisterForm";
import { useAuth } from "../context/useAuth";

export default function RegisterPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/boards", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <AuthLayout title="Create your DevBoard account" subtitle="Get started for free">
      <RegisterForm />
      <div className="mt-10 text-center text-sm text-text-secondary">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-primary-light hover:text-[#c996ff] underline-offset-2 hover:underline transition-colors">
          Sign in
        </Link>
      </div>
    </AuthLayout>
  );
}
