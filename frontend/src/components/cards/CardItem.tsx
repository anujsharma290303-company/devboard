
import type { Card } from "../../types/board";
import type { KeyboardEvent } from "react";
import { LabelBadge } from "../labels/LabelBadge";

type CardItemProps = {
  card: Card;
  onClick?: () => void;
};

export function CardItem({ card, onClick }: CardItemProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3 mb-1 transition-all duration-150 outline-none ${onClick ? "hover:shadow-md cursor-pointer" : ""}`}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={card.title}
    >
      {card.labels && card.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-1">
          {card.labels.map((label) => (
            <LabelBadge key={label.id} name={label.name} color={label.color} />
          ))}
        </div>
      )}
      <div className="font-medium text-slate-900 text-base truncate mb-1">{card.title}</div>
      {card.description && (
        <div className="text-slate-500 text-sm truncate max-w-full">
          {card.description}
        </div>
      )}
    </div>
  );
}
