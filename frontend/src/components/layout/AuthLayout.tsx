
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
		<div className="relative isolate min-h-screen flex items-center justify-center px-4 py-8 overflow-hidden">
			<div
				className="pointer-events-none absolute inset-0 -z-10"
				style={{
					background:
						"radial-gradient(circle at 10% 15%, rgb(255 77 141 / 0.25), transparent 30%), radial-gradient(circle at 84% 10%, rgb(255 228 94 / 0.24), transparent 30%), radial-gradient(circle at 82% 84%, rgb(87 178 255 / 0.24), transparent 34%), linear-gradient(155deg, #050812 0%, #111533 46%, #211342 100%)",
				}}
			/>
			<div className="rainbow-panel rainbow-glow w-full max-w-md rounded-2xl border border-white/10 bg-surface/85 shadow-2xl backdrop-blur-xl p-8 sm:p-10 relative z-10">
				<div className="mb-8 text-center">
					<h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary drop-shadow-md">
						{title}
					</h1>
					<p className="mt-2 text-base text-text-secondary">{subtitle}</p>
				</div>
				{children}
			</div>
		</div>
	);
}
