
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
      className={`mb-1 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm outline-none transition-all duration-150 ${
        onClick ? "cursor-pointer hover:shadow-md" : ""
      } ${isDragging ? "rotate-[1deg] scale-[1.02] shadow-lg ring-2 ring-blue-400" : ""}`}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={card.title}
    >
      {card.labels && card.labels.length > 0 && (
        <div className="mb-1 flex flex-wrap gap-1">
          {card.labels.map((label) => (
            <LabelBadge key={label.id} name={label.name} color={label.color} />
          ))}
        </div>
      )}

      <div className="mb-1 truncate text-base font-medium text-slate-900">
        {card.title}
      </div>

      {card.description && (
        <div className="max-w-full truncate text-sm text-slate-500">
          {card.description}
        </div>
      )}
    </div>
  );
}
