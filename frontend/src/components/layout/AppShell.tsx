import { Outlet, useMatch } from "react-router-dom";
import { Navbar } from "./Navbar";

export function AppShell() {
  const isBoardDetail = useMatch("/boards/:id");

  return (
    <div className="min-h-screen bg-[#f4f5f7] flex flex-col">
      <Navbar />
      <main
        className={
          isBoardDetail
            ? "flex-1 flex flex-col px-4 py-4 sm:px-6 overflow-hidden"
            : "mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
        }
      >
        <Outlet />
      </main>
    </div>
  );
}