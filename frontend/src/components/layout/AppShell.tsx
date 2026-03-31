import { Outlet, useMatch } from "react-router-dom";
import { Navbar } from "./Navbar";

export function AppShell() {
  const isBoardDetail = useMatch("/boards/:id");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Navbar />
      <main
        className={
          isBoardDetail
            ? "w-full px-4 py-6 sm:px-6"
            : "mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
        }
      >
        <Outlet />
      </main>
    </div>
  );
}