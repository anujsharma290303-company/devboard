import { useParams } from "react-router-dom";
import { useState, useMemo } from "react";
import { useBoard } from "../hooks/useBoard";
import { BoardDetailsSkeleton } from "../components/boards/BoardDetailsSkeleton";
import { BoardHeader } from "../components/boards/BoardHeader";
import { ColumnList } from "../components/columns/ColumnList";
import { CreateColumnModal } from "../components/columns/CreateColumnModal";
import { DragDropContext } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { useMoveCard } from "../hooks/useMoveCard";
import type { Column } from "../types/board";

export default function BoardDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [isColumnModalOpen, setColumnModalOpen] = useState(false);
  const [hasLocalState, setHasLocalState] = useState(false);

  const {
    data: board,
    isLoading,
    isError,
    error,
  } = useBoard(id ?? "");

  const moveCardMutation = useMoveCard(id ?? "");

  const initialColumns = useMemo<Column[]>(() => {
    if (!board?.columns) return [];
    return JSON.parse(JSON.stringify(board.columns));
  }, [board && board.columns]);

  const [localColumns, setLocalColumns] = useState<Column[]>([]);

  const columnsToRender = hasLocalState ? localColumns : initialColumns;

  if (!id) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8">
        <div className="mb-2 text-3xl">😕</div>
        <div className="mb-1 text-lg font-semibold">Board not found</div>
        <div className="text-slate-500">No board ID provided in the URL.</div>
      </div>
    );
  }

  if (isLoading || !board) {
    return <BoardDetailsSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8">
        <div className="mb-2 text-3xl">🚫</div>
        <div className="mb-1 text-lg font-semibold">Error loading board</div>
        <div className="text-slate-500">
          {error instanceof Error ? error.message : "Unknown error."}
        </div>
      </div>
    );
  }

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const workingColumns = JSON.parse(JSON.stringify(columnsToRender)) as Column[];

    const sourceColIdx = workingColumns.findIndex(
      (col) => col.id === source.droppableId
    );
    const destColIdx = workingColumns.findIndex(
      (col) => col.id === destination.droppableId
    );

    if (sourceColIdx === -1 || destColIdx === -1) return;

    const sourceCol = { ...workingColumns[sourceColIdx] };
    const destCol = { ...workingColumns[destColIdx] };

    const sourceCards = [...sourceCol.cards];
    const destCards =
      source.droppableId === destination.droppableId
        ? sourceCards
        : [...destCol.cards];

    const [movedCard] = sourceCards.splice(source.index, 1);
    if (!movedCard) return;

    destCards.splice(destination.index, 0, movedCard);

    sourceCol.cards = sourceCards;
    destCol.cards = destCards;

    workingColumns[sourceColIdx] = sourceCol;
    workingColumns[destColIdx] = destCol;

    setLocalColumns(workingColumns);
    setHasLocalState(true);

    moveCardMutation.mutate({
      cardId: draggableId,
      columnId: destCol.id,
      position: destination.index,
    });
  };

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-4 py-6">
      <BoardHeader
        board={board}
        onAddColumn={() => setColumnModalOpen(true)}
      />

      <div className="overflow-x-auto pb-2">
        <DragDropContext onDragEnd={onDragEnd}>
          <ColumnList
            columns={columnsToRender}
            onCreateColumn={() => setColumnModalOpen(true)}
            dndEnabled
          />
        </DragDropContext>
      </div>

      <CreateColumnModal
        open={isColumnModalOpen}
        onClose={() => setColumnModalOpen(false)}
        boardId={board.id}
      />
    </div>
  );
}