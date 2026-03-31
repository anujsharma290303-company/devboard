

import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { useBoards } from "../hooks/useBoards";
import { useCreateBoard } from "../hooks/useCreateBoard";
import { CreateBoardModal } from "../components/boards/CreateBoardModal";
import type { Board, CreateBoardPayload } from "../types/board";

export function BoardsPage() {
  const { data: boards, isLoading } = useBoards();
  const createBoardMutation = useCreateBoard();
  const [modalOpen, setModalOpen] = useState(false);
  const [fields, setFields] = useState({
    emoji: "📋",
    name: "",
    description: "",
  });
  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [formError, setFormError] = useState<string | undefined>(undefined);

  const validate = (values: typeof fields) => {
    const errs: { [k: string]: string } = {};
    if (!values.name.trim()) errs.name = "Board name is required";
    if (values.name.length > 50) errs.name = "Name too long";
    if (values.description.length > 200) errs.description = "Description too long";
    return errs;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFields((f) => ({ ...f, [name]: value }));
  };
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFields((f) => ({ ...f, [name]: value }));
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors(validate(fields));
  };

  const handleOpen = () => {
    setModalOpen(true);
    setFields({ emoji: "📋", name: "", description: "" });
    setTouched({});
    setErrors({});
    setFormError(undefined);
  };
  const handleClose = () => {
    setModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = validate(fields);
    setErrors(errs);
    setTouched({ name: true, description: true });
    if (Object.keys(errs).length > 0) return;
    setFormError(undefined);
    createBoardMutation.mutate(
      {
        name: fields.name.trim(),
        description: fields.description.trim() || undefined,
        emoji: fields.emoji.trim() || undefined,
      },
      {
        onSuccess: () => {
          setModalOpen(false);
        },
        onError: (err: any) => {
          setFormError(err?.message || "Failed to create board");
        },
      }
    );
  };

  return (
    <div className="space-y-8 animate-[fadeIn_0.3s_ease]">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Your Boards</h1>
          <p className="text-slate-400 mt-1 text-sm">Manage your workspaces, projects, and ideas.</p>
        </div>
        <Button variant="primary" className="shrink-0 group" onClick={handleOpen}>
          <svg className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Board
        </Button>
      </div>

      <CreateBoardModal
        open={modalOpen}
        onClose={handleClose}
        isPending={createBoardMutation.isPending}
        handleSubmit={handleSubmit}
        formError={formError}
        error={createBoardMutation.error}
        fields={fields}
        handleChange={handleChange}
        handleTextareaChange={handleTextareaChange}
        handleBlur={handleBlur}
        touched={touched}
        errors={errors}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-48 rounded-2xl bg-slate-800/50 animate-pulse border border-slate-800" />
          ))}
        </div>
      )}

      {/* Boards Grid */}
      {!isLoading && boards && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {boards.map((board: Board) => (
            <Link
              key={board.id}
              to={`/boards/${board.id}`}
              className="group relative flex flex-col h-48 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 hover:bg-slate-800/80 hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 overflow-hidden"
            >
              {/* Glowing Top Border effect on hover */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/0 to-transparent group-hover:via-indigo-500/50 transition-all duration-500" />

              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500/10 transition-all duration-300 shadow-sm">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                  </svg>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-white truncate mb-1 group-hover:text-indigo-300 transition-colors">
                {board.name}
              </h3>
              <p className="text-sm text-slate-400 line-clamp-2 flex-1 mb-4">
                {board.description || "No description provided."}
              </p>

              {/* Card Footer Metadata */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800/50 mt-auto">
                 <div className="flex items-center text-xs font-medium text-slate-500">
                    <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    {board.columns?.length || 0} Columns
                 </div>
                 <div className="flex items-center text-xs font-medium text-slate-500">
                    <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    {board.members?.length || 1} Members
                 </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ...existing code...
