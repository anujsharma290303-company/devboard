import React from "react";
import { Button } from "../ui/Button";

type BoardsEmptyStateProps = {
  onCreateBoard: () => void;
};

export const BoardsEmptyState: React.FC<BoardsEmptyStateProps> = ({ onCreateBoard }) => (
  <div className="flex flex-col items-center justify-center py-16 sm:py-28 text-center max-w-xs mx-auto w-full">
    <div className="text-5xl sm:text-6xl mb-4 sm:mb-5">📋</div>
    <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 text-gray-900">No boards yet</h2>
    <p className="text-gray-500 mb-6 sm:mb-8 max-w-xs text-base sm:text-lg">
      Get started by creating your first board. Organize your work, projects, or ideas with DevBoard.
    </p>
    <Button onClick={onCreateBoard} className="h-11 sm:h-12 px-6 sm:px-8 text-base font-semibold rounded-xl shadow-md w-full sm:w-auto">
      <span className="text-base sm:text-lg">+ Create Board</span>
    </Button>
  </div>
);
