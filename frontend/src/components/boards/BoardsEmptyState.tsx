import React from "react";
import { Button } from "../ui/Button";

type BoardsEmptyStateProps = {
  onCreateBoard: () => void;
};

export const BoardsEmptyState: React.FC<BoardsEmptyStateProps> = ({ onCreateBoard }) => (
  <div className="flex flex-col items-center justify-center py-28 text-center">
    <div className="text-6xl mb-5">📋</div>
    <h2 className="text-3xl font-extrabold mb-2 text-slate-900">No boards yet</h2>
    <p className="text-slate-500 mb-8 max-w-md text-base">
      Get started by creating your first board. Organize your work, projects, or ideas with DevBoard.
    </p>
    <Button onClick={onCreateBoard} className="h-12 px-8 text-base font-semibold rounded-xl shadow-md">
      <span className="text-lg">+ Create Board</span>
    </Button>
  </div>
);
