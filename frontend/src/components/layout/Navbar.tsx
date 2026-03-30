import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/useAuth";
import { Avatar } from "../ui/Avatar";
import { useNavigate } from "react-router-dom";

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const avatarButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDropdownOpen) return;

    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;

      if (
        avatarButtonRef.current &&
        !avatarButtonRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsDropdownOpen(false);
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isDropdownOpen]);

  return (
    <nav
      className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 shadow-md backdrop-blur supports-[backdrop-filter]:bg-white/80"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8 lg:px-10">
        {/* Left: Brand */}
        <div className="flex items-center gap-4 select-none">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-2xl shadow-sm ring-1 ring-blue-100">
            📋
          </div>

          <div className="flex flex-col leading-tight">
            <span className="text-lg font-bold text-slate-900">DevBoard</span>
            <span className="hidden text-xs text-slate-500 sm:block">
              Collaborative workspace
            </span>
          </div>
        </div>

        {/* Right: User */}
        <div className="flex items-center gap-4">
          {isAuthenticated && user && (
            <>
              <span
                className="hidden max-w-[160px] truncate text-sm font-medium text-slate-700 sm:block"
                title={user.displayName}
              >
                {user.displayName}
              </span>

              <div className="relative">
                <button
                  ref={avatarButtonRef}
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={isDropdownOpen}
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="rounded-full transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <Avatar
                    initials={user.displayName?.[0] || "U"}
                    alt={user.displayName || "User"}
                    size="md"
                    className="cursor-pointer"
                  />
                </button>

                {isDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 z-50 mt-3 w-44 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl ring-1 ring-slate-100"
                    role="menu"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate("/profile");
                      }}
                      className="w-full rounded-xl px-4 py-2 text-left text-sm font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-50"
                    >
                      Profile
                    </button>
                    <div className="my-1 border-t border-slate-100" />
                    <button
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        logout();
                        navigate("/login");
                      }}
                      className="w-full rounded-xl px-4 py-2 text-left text-sm font-medium text-red-600 transition-colors duration-150 hover:bg-red-50 focus:bg-red-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* subtle bottom separator */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
    </nav>
  );
};