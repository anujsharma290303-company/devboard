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
  "#0052cc", "#00875a", "#ff5630", "#6554c0",
  "#ff8b00", "#00b8d9", "#403294", "#de350b",
];

export function ColumnCard({ column, dndEnabled }: ColumnCardProps) {
  const [isCardModalOpen, setCardModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isCardDetailOpen, setCardDetailOpen] = useState(false);

  const accentColor = ACCENT_COLORS[column.title.charCodeAt(0) % ACCENT_COLORS.length];

  return (
    <div
      className="flex flex-col w-72 shrink-0 rounded-md bg-[#f4f5f7]"
      style={{
        borderTop: `3px solid ${accentColor}`,
        maxHeight: "calc(100vh - 180px)",
      }}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-3 py-2.5 bg-[#f4f5f7] rounded-t-md">
        <div className="flex items-center gap-2 min-w-0">
          <h3
            className="truncate text-xs font-bold text-slate-600 uppercase tracking-wider"
            title={column.title}
          >
            {column.title}
          </h3>
        </div>
        <span className="flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-slate-300 text-[10px] font-bold text-slate-600">
          {column.cards.length}
        </span>
      </div>

      {/* Droppable Card Area */}
      <Droppable droppableId={column.id} type="CARD">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 overflow-y-auto px-2 py-1 flex flex-col gap-2 transition-colors duration-150 ${
              snapshot.isDraggingOver
                ? "bg-blue-100"
                : "bg-[#f4f5f7]"
            }`}
            style={{ minHeight: "80px" }}
          >
            {column.cards.length === 0 && !snapshot.isDraggingOver && (
              <div className="mx-1 rounded border-2 border-dashed border-slate-300 py-8 text-center text-xs text-slate-400">
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
      <div className="px-2 pb-2 pt-1 bg-[#f4f5f7] rounded-b-md">
        <button
          type="button"
          onClick={() => setCardModalOpen(true)}
          className="flex w-full items-center gap-1.5 rounded px-2 py-2 text-sm text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors duration-150"
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