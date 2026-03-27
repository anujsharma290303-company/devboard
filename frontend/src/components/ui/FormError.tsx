import type { ReactNode } from "react";

type FormErrorProps = {
  children?: ReactNode;
};

export function FormError({ children }: FormErrorProps) {
  if (!children) return null;

  return (
    <div className="w-full rounded-xl border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-600 font-semibold mb-3 transition-opacity duration-200">
      {children}
    </div>
  );
}
