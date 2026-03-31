import { useParams } from "react-router-dom";
import { useState } from "react";
import { useBoard } from "../hooks/useBoard";
import { BoardDetailsSkeleton } from "../components/boards/BoardDetailsSkeleton";
import { BoardHeader } from "../components/boards/BoardHeader";
import { ColumnList } from "../components/columns/ColumnList";
import { CreateColumnModal } from "../components/columns/CreateColumnModal";
import { DragDropContext } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { useMoveCard } from "../hooks/useMoveCard";

export default function BoardDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [isColumnModalOpen, setColumnModalOpen] = useState(false);

  const { data: board, isLoading, isError, error } = useBoard(id ?? "");
  const moveCardMutation = useMoveCard(id ?? "");

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;

    moveCardMutation.mutate({
      cardId: draggableId,
      columnId: destination.droppableId,
      position: destination.index,
    });
  };

  if (!id) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8">
        <div className="mb-2 text-3xl">😕</div>
        <div className="mb-1 text-lg font-semibold text-slate-800">Board not found</div>
        <div className="text-slate-500 text-sm">No board ID provided in the URL.</div>
      </div>
    );
  }

  if (isLoading || !board) return <BoardDetailsSkeleton />;

  if (isError) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8">
        <div className="mb-2 text-3xl">🚫</div>
        <div className="mb-1 text-lg font-semibold text-slate-800">Error loading board</div>
        <div className="text-slate-500 text-sm">
          {error instanceof Error ? error.message : "Unknown error."}
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4 px-4 py-4">
      <BoardHeader
        board={board}
        onAddColumn={() => setColumnModalOpen(true)}
      />
      <DragDropContext onDragEnd={onDragEnd}>
        <ColumnList
          columns={board.columns ?? []}
          onCreateColumn={() => setColumnModalOpen(true)}
          dndEnabled
        />
      </DragDropContext>

      <CreateColumnModal
        open={isColumnModalOpen}
        onClose={() => setColumnModalOpen(false)}
        boardId={board.id}
      />
    </div>
  );
}