import type { ReactNode } from "react";

type FormErrorProps = {
  children?: ReactNode;
};

export function FormError({ children }: FormErrorProps) {
  if (!children) return null;

  return (
    <div className="w-full rounded-xl border border-[#ff4d8d66] bg-[#ff4d8d1a] px-4 py-2 text-sm text-[#ff96b9] font-semibold mb-3 transition-opacity duration-200">
      {children}
    </div>
  );
}
