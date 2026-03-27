import React from "react";
import type { Board } from "../../types/board";
import { BoardCard } from "./BoardCard";

type BoardGridProps = {
  boards: Board[];
  onBoardClick?: (board: Board) => void;
};

export const BoardGrid: React.FC<BoardGridProps> = ({ boards, onBoardClick }) => (
  <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {boards.map((board) => (
      <BoardCard
        key={board.id}
        board={board}
        onClick={onBoardClick}
      />
    ))}
  </div>
);