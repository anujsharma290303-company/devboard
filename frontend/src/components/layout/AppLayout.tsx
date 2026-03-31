import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

export function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30 flex flex-col">
      {/* Sleek, frosted-glass Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            </div>
            <Link to="/boards" className="text-xl font-bold text-white tracking-tight hover:text-indigo-400 transition-colors">
              DevBoard
            </Link>
          </div>
          <div className="flex items-center gap-4">
             {/* User Profile Area */}
             <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
                <span className="text-sm font-medium text-slate-400 hidden sm:block">
                  {user?.displayName || "User"}
                </span>
                <button 
                  onClick={logout} 
                  title="Sign out"
                  className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center hover:border-slate-500 hover:text-white transition-colors text-xs font-bold text-slate-300"
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
