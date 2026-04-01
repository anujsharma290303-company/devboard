import type { Column, Card } from "../../types/board";
import { useState } from "react";
import { CardItem } from "../cards/CardItem";
import { CreateCardModal } from "../cards/CreateCardModal";
import { CardDetailModal } from "../cards/CardDetailModal";
import { Draggable, Droppable } from "@hello-pangea/dnd";

type ColumnCardProps = {
  column: Column;
  dndEnabled?: boolean;
};

const ACCENT_COLORS = [
  "#ff4d8d", "#ffb347", "#ffe45e", "#4df7c8",
  "#57b2ff", "#b06bff", "#ff7a59", "#67e8f9",
];

export function ColumnCard({ column, dndEnabled }: ColumnCardProps) {
  const [isCardModalOpen, setCardModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isCardDetailOpen, setCardDetailOpen] = useState(false);

  const accentColor = ACCENT_COLORS[column.title.charCodeAt(0) % ACCENT_COLORS.length];

  return (
    <div
      className="rainbow-panel rainbow-glow flex flex-col rounded-2xl bg-surface shadow-md border border-border transition-all duration-200"
      style={{
        borderTop: `3px solid ${accentColor}`,
        minWidth: 280,
        maxWidth: 360,
        width: '100%',
      }}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-4 py-3 rounded-t-2xl border-b border-border bg-gradient-to-r from-background via-background to-primary/10">
        <div className="flex items-center gap-2 min-w-0">
          <h3
            className="truncate text-xs font-bold text-text-primary uppercase tracking-wider"
            title={column.title}
          >
            {column.title}
          </h3>
        </div>
        <span className="rainbow-pill flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-extrabold shadow-sm">
          {column.cards.length}
        </span>
      </div>

      {/* Droppable Card Area */}
      <Droppable droppableId={column.id} type="CARD">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 min-h-[170px] px-2 py-3 flex flex-col gap-3 transition-colors duration-150 ${
              snapshot.isDraggingOver
                ? "bg-primary/8"
                : "bg-surface"
            }`}
          >
            {column.cards.length === 0 && !snapshot.isDraggingOver && (
              <div className="mx-2 rounded-xl border-2 border-dashed border-border py-8 text-center text-xs text-text-muted">
                No cards yet
              </div>
            )}

            {column.cards.map((card, idx) =>
              dndEnabled ? (
                <Draggable
                  key={card.id}
                  draggableId={card.id}
                  index={idx}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={provided.draggableProps.style}
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
            )}

            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Add Card Button */}
      <div className="px-3 pb-3 pt-2 bg-surface/95 rounded-b-2xl border-t border-border">
        <button
          type="button"
          onClick={() => setCardModalOpen(true)}
          className="flex w-full items-center gap-1.5 rounded-xl px-2 py-2 text-sm text-text-secondary hover:bg-primary/10 hover:text-text-primary transition-colors duration-150"
        >
          <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add card
        </button>
      </div>

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