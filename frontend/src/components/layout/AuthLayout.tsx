
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
		<div className="relative isolate min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 overflow-hidden">
			<div className="pointer-events-none absolute inset-0 -z-10">
				{/* Remove neon shapes for a more professional look */}
			</div>
			<div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/80 shadow-2xl backdrop-blur-xl p-8 sm:p-10 relative z-10">
				<div className="mb-8 text-center">
					<h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white drop-shadow-md">
						{title}
					</h1>
					<p className="mt-2 text-base text-slate-300/80">{subtitle}</p>
				</div>
				{children}
			</div>
		</div>
	);
}
