import React from "react";
import { Link } from "react-router-dom";
import type { Board } from "../../types/board";

type BoardCardProps = {
  board: Board;
  onClick?: (board: Board) => void;
};

export const BoardCard: React.FC<BoardCardProps> = ({ board, onClick }) => {
  // onClick is preserved for compatibility, but navigation is handled by Link
  return (
    <Link
      to={`/boards/${board.id}`}
      className="group w-full text-left bg-white rounded-2xl shadow border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 ease-in-out p-4 sm:p-6 flex flex-col gap-2 sm:gap-3 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 no-underline min-h-[160px]"
      aria-label={`Open board ${board.name}`}
      onClick={onClick ? (e) => { e.stopPropagation(); onClick(board); } : undefined}
    >
      <div className="flex items-center gap-2 sm:gap-3 mb-2">
        <span className="text-3xl sm:text-4xl select-none">
          {board.emoji || "📋"}
        </span>
        <span className="font-bold text-base sm:text-lg truncate flex-1 text-gray-900" title={board.name}>
          {board.name}
        </span>
      </div>
      <div className="text-gray-700 text-[15px] truncate mb-2 min-h-[1.25rem]">
        {board.description?.trim()
          ? board.description
          : <span className="italic text-gray-400">No description</span>
        }
      </div>
      <div className="flex items-center gap-4 sm:gap-6 mt-auto text-xs text-gray-400 pt-2 border-t border-gray-100">
        <span className="flex items-center gap-1">
          <span className="font-semibold text-gray-700">
            {board._count?.columns ?? 0}
          </span>
          Columns
        </span>
        <span className="flex items-center gap-1">
          <span className="font-semibold text-gray-700">
            {board._count?.members ?? 0}
          </span>
          Members
        </span>
      </div>
    </Link>
  );
};