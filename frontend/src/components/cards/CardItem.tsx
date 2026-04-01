
import type { Card } from "../../types/board";
import type { KeyboardEvent } from "react";
import { LabelBadge } from "../labels/LabelBadge";
import { CardAssignee } from "./CardAssignee";
import type { BoardMemberUser } from "../../types/board";
import { CardPriorityIcon } from "./CardPriorityIcon";

export type CardItemProps = {
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


	// Extend Card type to include optional meta fields for UI/UX
	type CardWithMeta = Card & {
		assignee?: unknown;
		priority?: string;
		dueDate?: string | null;
	};
	const metaCard = card as CardWithMeta;
	let assignee: BoardMemberUser | null | undefined = null;
	if (metaCard.assignee && typeof metaCard.assignee === "object" &&
			"id" in metaCard.assignee &&
			"displayName" in metaCard.assignee &&
			"email" in metaCard.assignee &&
			"avatarPath" in metaCard.assignee) {
		assignee = metaCard.assignee as BoardMemberUser;
	}
	const priority = metaCard.priority || "";
	const dueDate = metaCard.dueDate || null;

	// Due date color logic
	let dueColor = "";
	let dueLabel = "";
	if (dueDate) {
		const due = new Date(dueDate);
		const now = new Date();
		const diff = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
		if (diff < 0) {
			dueColor = "text-red-500 font-bold";
			dueLabel = "Overdue";
		} else if (diff < 2) {
			dueColor = "text-orange-500 font-semibold";
			dueLabel = "Due Soon";
		}
	}

	return (
		<div
					       className={`rainbow-panel group rounded-2xl px-4 py-3 cursor-pointer select-none transition-all duration-150 font-sans outline-none focus:ring-2 focus:ring-primary/30 ${
						       isDragging
							       ? "rainbow-glow border-primary ring-2 ring-primary/20 opacity-95"
							       : "border-border shadow-sm hover:rainbow-glow hover:border-primary-light"
						       }`}
			role="button"
			tabIndex={0}
			onClick={onClick}
			onKeyDown={handleKeyDown}
			aria-label={card.title}
			title={card.title}
			style={isDragging ? { zIndex: 10 } : {}}
		>
			       <div className="flex items-center justify-between mb-2">
				       <div className="flex items-center gap-2">
					       <CardAssignee user={assignee} />
					       <span className="ml-1">
						 <CardPriorityIcon priority={priority} />
					       </span>
				       </div>
				       {dueDate && (
					       <span className={`text-xs ml-2 ${dueColor}`} title={dueLabel}>
						       {new Date(dueDate).toLocaleDateString()}
					       </span>
				       )}
			       </div>
					       <p className="text-base font-semibold text-text-primary leading-snug truncate mb-1 group-hover:text-primary transition-colors" title={card.title}>
						       {card.title}
					       </p>
			       {card.labels && card.labels.length > 0 && (
				       <div className="mt-1 flex flex-wrap gap-1">
					       {card.labels.map((label) => (
						       <LabelBadge key={label.id} name={label.name} color={label.color} />
					       ))}
				       </div>
			       )}
					       {card.description && (
						       <p className="mt-1 text-xs text-text-muted line-clamp-2 leading-relaxed">
							       {card.description}
						       </p>
					       )}
		</div>
	);
}

