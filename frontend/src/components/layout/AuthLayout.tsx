
import type { ReactNode } from "react";

type AuthLayoutProps = {
	children: ReactNode;
	title?: string;
	subtitle?: string;
};

export function AuthLayout({
	children,
	title = "DevBoard",
	subtitle = "Welcome back",
}: AuthLayoutProps) {
	       return (
			   <div className="relative isolate min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#312e81] overflow-hidden">
				       <div className="pointer-events-none absolute inset-0 -z-10">
					       {/* Animated neon shapes - higher opacity and glow for visibility */}
					       <div className="absolute left-8 top-8 w-40 h-40 rounded-full bg-cyan-400/70 blur-3xl shadow-[0_0_60px_10px_rgba(34,211,238,0.5)] animate-float-slow border-2 border-cyan-300/40" />
					       <div className="absolute right-8 bottom-8 w-28 h-28 rounded-2xl bg-fuchsia-500/60 blur-2xl shadow-[0_0_40px_8px_rgba(232,121,249,0.4)] animate-float-medium border-2 border-fuchsia-300/40" />
					       <div className="absolute left-1/2 top-0 -translate-x-1/2 w-24 h-24 rounded-full bg-blue-400/50 blur-xl shadow-[0_0_32px_6px_rgba(96,165,250,0.3)] animate-float-fast border-2 border-blue-300/30" />
					       {/* Pop effect shape */}
					       <div className="absolute right-1/3 top-1/2 w-10 h-10 rounded-full bg-emerald-400/60 blur-md shadow-[0_0_24px_4px_rgba(52,211,153,0.3)] animate-pop border-2 border-emerald-300/40" />
				       </div>
			       <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/10 shadow-2xl backdrop-blur-xl p-8 sm:p-10 relative z-10">
				       <div className="mb-8 text-center">
					       <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white drop-shadow-md">
						       {title}
					       </h1>
					       <p className="mt-2 text-base text-slate-200/80">{subtitle}</p>
				       </div>
				       {children}
			       </div>
		       </div>
	       );
}
