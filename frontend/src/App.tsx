import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { GuestRoute } from "./components/auth/GuestRoute";

function BoardsPlaceholder() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="rounded-xl bg-white p-8 shadow-md">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Boards</h1>
        <p className="text-slate-600">This is a placeholder for the boards dashboard.</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Root path redirect */}
      <Route path="/" element={<AuthRedirect />} />
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/boards" element={<BoardsPlaceholder />} />
      </Route>
      {/* Wildcard route: redirect based on auth */}
      <Route path="*" element={<AuthRedirect />} />
    </Routes>
  );
}

import { useAuth } from "./context/useAuth";

function AuthRedirect() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/boards" replace />;
  }
  return <Navigate to="/login" replace />;
}