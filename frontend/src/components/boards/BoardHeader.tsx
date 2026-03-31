import type { Board } from "../../types/board";
import { Button } from "../ui/Button";

type BoardHeaderProps = {
  board: Board;
  onAddColumn?: () => void;
};

export function BoardHeader({ board, onAddColumn }: BoardHeaderProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-2 sm:px-1 pb-2 border-b border-gray-200 mb-2 bg-white">
      <div className="flex items-start gap-2 sm:gap-4 flex-wrap">
        <span className="text-3xl sm:text-4xl select-none mt-1">{board.emoji || "📋"}</span>
        <div>
          <div className="font-bold text-xl sm:text-2xl text-gray-900 mb-1 flex items-center gap-2 flex-wrap">
            {board.name}
          </div>
          {board.description && (
            <div className="text-gray-600 text-sm sm:text-base mb-1 max-w-xs sm:max-w-2xl whitespace-pre-line">
              {board.description}
            </div>
          )}
          <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm text-gray-500 mt-1">
            <span>
              <span className="font-semibold text-gray-700">{board.columns?.length ?? 0}</span> Columns
            </span>
            <span>
              <span className="font-semibold text-gray-700">{board.members?.length ?? board._count?.members ?? 0}</span> Members
            </span>
          </div>
        </div>
      </div>
      <div className="mt-3 sm:mt-0 w-full sm:w-auto">
        <Button type="button" className="rounded-md px-4 sm:px-5 py-2 w-full sm:w-auto" onClick={onAddColumn}>
          + Add Column
        </Button>
      </div>
    </div>
  );
}
