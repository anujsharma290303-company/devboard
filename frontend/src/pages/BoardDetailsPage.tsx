import { useParams } from "react-router-dom";
import { useState } from "react";
import { useBoard } from "../hooks/useBoard";
import { BoardDetailsSkeleton } from "../components/boards/BoardDetailsSkeleton.tsx";
import { BoardHeader } from "../components/boards/BoardHeader";
import { ColumnList } from "../components/columns/ColumnList.tsx";
import { CreateColumnModal } from "../components/columns/CreateColumnModal";

export default function BoardDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [isColumnModalOpen, setColumnModalOpen] = useState(false);
  const {
    data: board,
    isLoading,
    isError,
    error,
  } = useBoard(id ?? "");

  if (!id) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="text-3xl mb-2">😕</div>
        <div className="font-semibold text-lg mb-1">Board not found</div>
        <div className="text-slate-500">No board ID provided in the URL.</div>
      </div>
    );
  }

  if (isLoading) {
    return <BoardDetailsSkeleton />;
  }

  if (isError || !board) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="text-3xl mb-2">🚫</div>
        <div className="font-semibold text-lg mb-1">Error loading board</div>
        <div className="text-slate-500">{error instanceof Error ? error.message : "Unknown error."}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-6 max-w-[1600px] mx-auto w-full">
      <BoardHeader board={board} onAddColumn={() => setColumnModalOpen(true)} />
      <div className="overflow-x-auto pb-2">
        <ColumnList columns={board.columns ?? []} onCreateColumn={() => setColumnModalOpen(true)} />
      </div>
      <CreateColumnModal
        open={isColumnModalOpen}
        onClose={() => setColumnModalOpen(false)}
        boardId={board.id}
      />
    </div>
  );
}
