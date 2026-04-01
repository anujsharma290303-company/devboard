import { AuthLayout } from "../components/layout/AuthLayout";
import { ResetPasswordForm } from "../components/auth/ResetPasswordForm";
import { useSearchParams, Link } from "react-router-dom";

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get("token");

  if (!token) {
    return (
      <AuthLayout title="Reset Password" subtitle="Your reset link appears to be invalid.">
        <div className="space-y-5 text-center">
          <div className="rounded-xl border border-[#ff4d8d66] bg-[#ff4d8d1a] px-4 py-4 text-sm font-medium text-[#ff96b9]">
            Invalid or missing reset token.
          </div>

          <Link
            to="/forgot-password"
            className="inline-block text-sm font-medium text-primary-light transition-colors hover:text-[#c996ff] hover:underline"
          >
            Request a new reset link
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your new password below."
    >
      <ResetPasswordForm token={token} />
    </AuthLayout>
  );
}
