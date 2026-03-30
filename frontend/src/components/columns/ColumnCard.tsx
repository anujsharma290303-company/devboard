

import type { Column, Card } from "../../types/board";
import { useState } from "react";
import { CardItem } from "../cards/CardItem";
import { Button } from "../ui/Button";
import { CreateCardModal } from "../cards/CreateCardModal";
import { CardDetailModal } from "../cards/CardDetailModal";

export function ColumnCard({ column }: { column: Column }) {
  const [isCardModalOpen, setCardModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isCardDetailOpen, setCardDetailOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col w-80 min-w-[18rem] max-w-xs p-4 gap-4">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold text-lg text-slate-800 truncate" title={column.title}>{column.title}</div>
        <span className="text-xs text-slate-400 font-medium">{column.cards.length} cards</span>
      </div>
      <div className="flex flex-col gap-3 min-h-[40px]">
        {column.cards.length === 0 ? (
          <div className="text-slate-400 italic text-sm text-center py-4">No cards yet</div>
        ) : (
          column.cards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              onClick={() => {
                setSelectedCard(card);
                setCardDetailOpen(true);
              }}
            />
          ))
        )}
      </div>
      <Button type="button" className="mt-2 rounded-lg w-full" onClick={() => setCardModalOpen(true)}>
        + Add Card
      </Button>
      <CreateCardModal
        open={isCardModalOpen}
        onClose={() => setCardModalOpen(false)}
        boardId={column.boardId}
        columnId={column.id}
      />
      <CardDetailModal
        open={isCardDetailOpen}
        onClose={() => {
          setCardDetailOpen(false);
          setSelectedCard(null);
        }}
        card={selectedCard}
        columnTitle={column.title}
        boardId={column.boardId}
      />
    </div>
  );
}
