


import type { Column, Card } from "../../types/board";
import { useState } from "react";
import { CardItem } from "../cards/CardItem";
import { Button } from "../ui/Button";
import { CreateCardModal } from "../cards/CreateCardModal";
import { CardDetailModal } from "../cards/CardDetailModal";
import { Draggable, Droppable } from "@hello-pangea/dnd";

type ColumnCardProps = {
  column: Column;
  dndEnabled?: boolean;
};

export function ColumnCard({ column, dndEnabled }: ColumnCardProps) {
  const [isCardModalOpen, setCardModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isCardDetailOpen, setCardDetailOpen] = useState(false);

  return (
    <div className="flex w-80 min-w-[18rem] max-w-xs flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <div
          className="truncate text-lg font-semibold text-slate-800"
          title={column.title}
        >
          {column.title}
        </div>
        <span className="text-xs font-medium text-slate-400">
          {column.cards.length} cards
        </span>
      </div>

      <Droppable droppableId={column.id} type="CARD">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex min-h-[120px] flex-col gap-3 rounded-lg transition-colors ${
              snapshot.isDraggingOver ? "bg-blue-50/70" : ""
            }`}
          >
            {column.cards.length === 0 ? (
              <div className="py-4 text-center text-sm italic text-slate-400">
                No cards yet
              </div>
            ) : (
              column.cards.map((card, idx) =>
                dndEnabled ? (
                  <Draggable draggableId={card.id} index={idx} key={card.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <CardItem
                          card={card}
                          isDragging={snapshot.isDragging}
                          onClick={() => {
                            setSelectedCard(card);
                            setCardDetailOpen(true);
                          }}
                        />
                      </div>
                    )}
                  </Draggable>
                ) : (
                  <CardItem
                    key={card.id}
                    card={card}
                    onClick={() => {
                      setSelectedCard(card);
                      setCardDetailOpen(true);
                    }}
                  />
                )
              )
            )}

            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <Button
        type="button"
        className="mt-2 w-full rounded-lg"
        onClick={() => setCardModalOpen(true)}
      >
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
