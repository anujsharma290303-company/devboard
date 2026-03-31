


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
    <div
      className="
        flex flex-col
        w-full sm:w-80 max-w-xs shrink-0
        rounded-2xl
        border border-gray-200
        bg-white
        shadow-lg
        snap-center sm:snap-align-none
        p-0
        max-h-[90vh]
        overflow-hidden
        transition-all duration-200
      "
    >
      {/* Fixed Header */}
      <div className="flex-none p-5 pb-4 flex items-center justify-between border-b border-gray-200 bg-transparent">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
          <h3 className="truncate text-base font-semibold text-gray-900 tracking-tight" title={column.title}>
            {column.title}
          </h3>
        </div>
        <span className="flex items-center justify-center h-6 px-2 rounded-lg bg-gray-100 text-xs font-medium text-gray-500 border border-gray-200">
          {column.cards.length}
        </span>
      </div>

      {/* Scrollable Card List */}
      <Droppable droppableId={column.id} type="CARD">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 overflow-y-auto overflow-x-hidden p-4 transition-colors duration-200 ${
              snapshot.isDraggingOver ? "bg-indigo-500/10" : ""
            }`}
          >
            <div className="flex flex-col gap-4 min-h-[10px]">
              {column.cards.length === 0 && !snapshot.isDraggingOver ? (
                <div className="py-10 text-center text-sm font-medium text-gray-400/60 border-2 border-dashed border-gray-300 rounded-xl bg-white/60">
                  Drop cards here
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
                          className="transition-shadow duration-150"
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
          </div>
        )}
      </Droppable>

      {/* Fixed Footer */}
      <div className="flex-none p-4 pt-0">
        <Button
          type="button"
          variant="secondary"
          className="w-full justify-start text-gray-500 hover:text-indigo-600 border-transparent hover:border-gray-300 bg-transparent hover:bg-gray-100 shadow-none transition-colors"
          onClick={() => setCardModalOpen(true)}
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Card
        </Button>
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
