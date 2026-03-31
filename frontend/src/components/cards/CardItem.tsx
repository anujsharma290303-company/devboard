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
      className={`
        rounded bg-white border px-3 py-2.5 cursor-pointer select-none
        transition-shadow duration-100
        ${isDragging
          ? "shadow-xl border-blue-400 ring-2 ring-blue-200 opacity-95"
          : "border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300"
        }
      `}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={card.title}
    >
      {card.labels && card.labels.length > 0 && (
        <div className="mb-1.5 flex flex-wrap gap-1">
          {card.labels.map((label) => (
            <LabelBadge key={label.id} name={label.name} color={label.color} />
          ))}
        </div>
      )}

      <p className="text-sm font-medium text-slate-800 leading-snug">
        {card.title}
      </p>

      {card.description && (
        <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {card.description}
        </p>
      )}
    </div>
  );
}