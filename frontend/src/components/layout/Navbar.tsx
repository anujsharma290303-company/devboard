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
      className="sticky top-0 z-20 w-full border-b border-border bg-navbar/80 shadow-md backdrop-blur supports-[backdrop-filter]:bg-navbar/60 font-sans"
      aria-label="Main navigation"
    >
      <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand */}
        <div className="flex select-none items-center gap-4">
          <div className="rainbow-pill rainbow-glow flex h-10 w-10 items-center justify-center rounded-xl text-2xl ring-1 ring-white/20">
            📋
          </div>

          <div className="flex flex-col leading-tight">
            <span className="text-lg font-bold text-text-primary">DevBoard</span>
            <span className="hidden text-xs text-text-muted sm:block">
              Collaborative workspace
            </span>
          </div>
        </div>

        {/* Right: User */}
        <div className="flex items-center gap-4">
          {isAuthenticated && user && (
            <>
              <span
                className="hidden max-w-[160px] truncate text-sm font-medium text-text-secondary sm:block"
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
                  className="rounded-full transition-shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
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
                    className="rainbow-panel absolute right-0 z-50 mt-3 w-44 rounded-2xl p-2 shadow-xl"
                    role="menu"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate("/profile");
                      }}
                      className="w-full rounded-xl px-4 py-2 text-left text-sm font-medium text-text-secondary transition-colors duration-150 hover:bg-primary/12 hover:text-text-primary"
                    >
                      Profile
                    </button>

                    <div className="my-1 border-t border-border" />

                    <button
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        logout();
                        navigate("/login");
                      }}
                      className="w-full rounded-xl px-4 py-2 text-left text-sm font-medium text-red-400 transition-colors duration-150 hover:bg-red-900/30 focus:bg-red-900/40"
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

      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#57b2ff66] to-transparent" />
    </nav>
  );
};