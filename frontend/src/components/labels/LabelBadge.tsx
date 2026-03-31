import React from "react";

type Props = {
  name: string;
  color: string;
};

export function LabelBadge({ name, color }: Props) {
  // Tinted glass: 10% bg, 30% border, text = color
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap border transition-colors hover:brightness-110 select-none"
      style={{
        backgroundColor: `${color}1A`, // 10% opacity
        borderColor: `${color}4D`,     // 30% opacity
        color: color,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shadow-sm"
        style={{ backgroundColor: color, boxShadow: `0 0 4px ${color}` }}
      />
      {name}
    </span>
  );
}
