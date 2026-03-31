
import type { Card } from "../../types/board";
import type { KeyboardEvent } from "react";
import { LabelBadge } from "../labels/LabelBadge";

type CardItemProps = {
  card: Card;
  onClick?: () => void;
  isDragging?: boolean;
};

export function CardItem({ card, onClick, isDragging }: CardItemProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) return;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={`group relative rounded-xl border border-slate-700/60 bg-slate-800/80 p-4 shadow-sm backdrop-blur-sm outline-none transition-all duration-200 ${
        onClick ? "cursor-pointer hover:border-indigo-500/50 hover:bg-slate-700/80 hover:shadow-md hover:-translate-y-0.5" : ""
      } ${
        isDragging ? "rotate-2 scale-105 border-indigo-500/80 bg-slate-800 shadow-2xl shadow-black/80 z-50 ring-1 ring-indigo-500" : ""
      }`}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={card.title}
    >
      {card.labels && card.labels.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {card.labels.map((label) => (
            <LabelBadge key={label.id} name={label.name} color={label.color} />
          ))}
        </div>
      )}

      <div className="mb-1.5 text-sm font-medium text-white leading-snug">
        {card.title}
      </div>

      {card.description && (
        <div className="line-clamp-2 text-xs text-slate-400 leading-relaxed">
          {card.description}
        </div>
      )}
      {/* Card Metadata (Optional: Mocked for visual completeness) */}
      <div className="mt-3 flex items-center justify-between pt-3 border-t border-slate-700/50">
        <div className="flex items-center gap-3 text-slate-500">
           {/* If you add attachments/comments counts later, they go here */}
           <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
           </svg>
        </div>
      </div>
    </div>
  );
}
