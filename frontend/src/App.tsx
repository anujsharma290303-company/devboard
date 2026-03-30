
  import { Routes, Route, Navigate } from "react-router-dom";
  import { BoardsPage } from "./pages/BoardsPage";
  import BoardDetailsPage from "./pages/BoardDetailsPage";
  import { AppShell } from "./components/layout/AppShell";
  import LoginPage from "./pages/LoginPage";
  import RegisterPage from "./pages/RegisterPage";
  import { ProtectedRoute } from "./components/auth/ProtectedRoute";
  import { GuestRoute } from "./components/auth/GuestRoute";
  import ForgotPasswordPage from "./pages/ForgotPasswordPage.tsx";
  import ResetPasswordPage from "./pages/ResetPasswordPage.tsx";
  import { useAuth } from "./context/useAuth";


export default function App() {
  return (
      <Routes>
        {/* Root path redirect */}
        <Route path="/" element={<AuthRedirect />} />
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/boards" element={<BoardsPage />} />
            <Route path="/boards/:id" element={<BoardDetailsPage />} />
          </Route>
        </Route>
        {/* Wildcard route: redirect based on auth */}
        <Route path="*" element={<AuthRedirect />} />
      </Routes>
  );
}


  function AuthRedirect() {
    const { isAuthenticated } = useAuth();
    if (isAuthenticated) {
      return <Navigate to="/boards" replace />;
    }
    return <Navigate to="/login" replace />;
  }