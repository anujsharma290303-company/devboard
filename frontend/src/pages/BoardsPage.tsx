import { useState } from "react";
import { useCreateBoard } from "../hooks/useCreateBoard";

import { useBoards } from "../hooks/useBoards";
import { BoardGrid } from "../components/boards/BoardGrid";
import { BoardsEmptyState } from "../components/boards/BoardsEmptyState";
import { CreateBoardModal } from "../components/boards/CreateBoardModal";
import { Button } from "../components/ui/Button";
import { Skeleton } from "../components/ui/Skeleton";

export function BoardsPage() {
  const { data: boards, isLoading, isError, error } = useBoards();
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  // Create Board Modal form state
  const [fields, setFields] = useState({ emoji: "📋", name: "", description: "" });
  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [formError, setFormError] = useState<string | undefined>(undefined);
  const createBoardMutation = useCreateBoard();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const validate = () => {
    const newErrors: { [k: string]: string } = {};
    if (!fields.name.trim()) newErrors.name = "Board name is required.";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(undefined);
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    createBoardMutation.mutate(
      {
        name: fields.name,
        description: fields.description,
        emoji: fields.emoji,
      },
      {
        onSuccess: () => {
          setCreateModalOpen(false);
          setFields({ emoji: "📋", name: "", description: "" });
          setTouched({});
          setErrors({});
        },
        onError: (err: unknown) => {
          if (err && typeof err === 'object' && 'message' in err && typeof (err as any).message === 'string') {
            setFormError((err as { message: string }).message);
          } else {
            setFormError("Failed to create board.");
          }
        },
      }
    );
  };

  return (
    <>
      <section className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Your Boards
          </h1>
          <p className="text-base text-slate-500 max-w-lg">
            Manage your workspaces, projects, and ideas in one place.
          </p>
        </div>
        <Button
          onClick={() => setCreateModalOpen(true)}
          className="w-full sm:w-auto px-6 py-3 text-base font-semibold rounded-xl shadow-md"
        >
          + Create Board
        </Button>
      </section>

      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="card" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-red-500 font-semibold py-10">{error instanceof Error ? error.message : "Failed to load boards."}</div>
      ) : boards && boards.length > 0 ? (
        <BoardGrid boards={boards} />
      ) : (
        <BoardsEmptyState onCreateBoard={() => setCreateModalOpen(true)} />
      )}

      <CreateBoardModal
        open={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        isPending={createBoardMutation.isPending}
        handleSubmit={handleSubmit}
        formError={formError}
        error={createBoardMutation.error}
        fields={fields}
        handleChange={handleChange}
        handleBlur={handleBlur}
        touched={touched}
        errors={errors}
      />
    </>
  );
}