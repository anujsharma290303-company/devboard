import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

export function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background text-text-secondary font-sans selection:bg-primary/30 flex flex-col">
      {/* Sleek, frosted-glass Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-navbar/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg rainbow-pill flex items-center justify-center shadow-lg shadow-primary/20">
              <svg className="w-5 h-5 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            </div>
            <Link to="/boards" className="text-xl font-bold text-text-primary tracking-tight hover:text-primary-light transition-colors">
              DevBoard
            </Link>
          </div>
          <div className="flex items-center gap-4">
             {/* User Profile Area */}
             <div className="flex items-center gap-3 pl-4 border-l border-border">
                <span className="text-sm font-medium text-text-muted hidden sm:block">
                  {user?.displayName || "User"}
                </span>
                <button 
                  onClick={logout} 
                  title="Sign out"
                  className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center hover:border-primary-light hover:text-text-primary transition-colors text-xs font-bold text-text-secondary"
                >
                   {user?.displayName?.charAt(0) || "U"}
                </button>
             </div>
          </div>
        </div>
      </header>
      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
