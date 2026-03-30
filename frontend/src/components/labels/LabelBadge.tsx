import React from "react";

export type LabelBadgeProps = {
  name: string;
  color: string;
  className?: string;
};

export const LabelBadge: React.FC<LabelBadgeProps> = ({ name, color, className }) => {
  // Ensure text is readable on colored backgrounds
  const getTextColor = (bg: string) => {
    // Simple heuristic for dark/light backgrounds
    const darkColors = ["#1e293b", "#334155", "#0f172a", "#4b5563", "#6b7280", "gray", "purple", "blue", "indigo", "#6366f1"];
    return darkColors.some((c) => bg.includes(c)) ? "text-white" : "text-slate-900";
  };

  return (
    <span
      className={`inline-block rounded-full px-3 py-0.5 text-xs font-medium bg-[${color}] ${getTextColor(color)} shadow-sm border border-black/5 ${className || ""}`}
      style={{ backgroundColor: color }}
      title={name}
    >
      {name}
    </span>
  );
};
