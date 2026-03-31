import React from "react";
import type { Board } from "../../types/board";
import { BoardCard } from "./BoardCard";

type BoardGridProps = {
  boards: Board[];
  onBoardClick?: (board: Board) => void;
};

export const BoardGrid: React.FC<BoardGridProps> = ({ boards, onBoardClick }) => (
  <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 auto-rows-fr">
    {boards.map((board) => (
      <BoardCard
        key={board.id}
        board={board}
        onClick={onBoardClick}
      />
    ))}
  </div>
);