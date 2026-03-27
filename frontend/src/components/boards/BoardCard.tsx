import React from "react";
import type { Board } from "../../types/board";


type BoardCardProps = {
  board: Board;
  onClick?: (board: Board) => void;
};

export const BoardCard: React.FC<BoardCardProps> = ({ board, onClick }) => {
  const handleClick = () => {
    if (onClick) onClick(board);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group w-full text-left bg-white rounded-2xl shadow border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 ease-in-out p-6 flex flex-col gap-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label={`Open board ${board.name}`}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-4xl select-none drop-shadow-sm">
          {board.emoji || "📋"}
        </span>
        <span className="font-bold text-lg truncate flex-1 text-slate-900" title={board.name}>
          {board.name}
        </span>
      </div>
          {/* Example Badge usage for future role/priority/status */}
          {/* <Badge variant="blue">Owner</Badge> */}
      <div className="text-slate-700 dark:text-slate-200 text-[15px] truncate mb-2 min-h-[1.25rem]">
        {board.description?.trim()
          ? board.description
          : <span className="italic text-slate-400 dark:text-slate-500">No description</span>
        }
      </div>
      <div className="flex items-center gap-6 mt-auto text-xs text-slate-400 pt-2 border-t border-slate-100">
        <span className="flex items-center gap-1">
          <span className="font-semibold text-slate-700">
            {board._count?.columns ?? 0}
          </span>
          Columns
        </span>
        <span className="flex items-center gap-1">
          <span className="font-semibold text-slate-700">
            {board._count?.members ?? 0}
          </span>
          Members
        </span>
      </div>
    </button>
  );
};