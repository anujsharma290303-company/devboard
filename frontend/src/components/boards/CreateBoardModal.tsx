
import { Button } from "../ui/Button";
import { FormError } from "../ui/FormError";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { Modal } from "../ui/Modal";

type CreateBoardModalProps = {
  open: boolean;
  onClose: () => void;
  isPending: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  formError?: string;
  error?: unknown;
  fields: {
    emoji: string;
    name: string;
    description: string;
  };
  handleChange: React.ChangeEventHandler<HTMLInputElement>;
  handleTextareaChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  handleBlur: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  touched: Record<string, boolean>;
  errors: Record<string, string>;
};
// ...other imports (FormError, Input, etc.)

// ...component logic (props, state, handlers)

export function CreateBoardModal(props: CreateBoardModalProps) {
  const { open, onClose, isPending, handleSubmit, formError, error, fields, handleChange, handleTextareaChange, handleBlur, touched, errors } = props;
  if (!open) return null;

  return (
    <Modal isOpen={open} onClose={onClose} title="Create Board">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-6 w-full px-2 sm:px-0">
        <FormError>
          {formError || (error instanceof Error ? error.message : undefined)}
        </FormError>
        <Input
          name="emoji"
          label="Emoji"
          placeholder="📋"
          value={fields.emoji}
          onChange={handleChange}
          onBlur={handleBlur}
          maxLength={4}
          disabled={isPending}
          theme="light"
        />
        <Input
          name="name"
          label="Board Name"
          placeholder="Board name"
          value={fields.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.name && errors.name ? errors.name : undefined}
          disabled={isPending}
          required
          theme="light"
        />


        <Textarea
          name="description"
          label="Description"
          placeholder="Short description"
          value={fields.description}
          onChange={handleTextareaChange}
          onBlur={handleBlur}
          disabled={isPending}
          error={touched.description && errors.description ? errors.description : undefined}
          rows={3}
        />

        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 mt-2">
          <Button
            type="button"
            variant="secondary"
            className="w-full sm:w-auto py-3 rounded-lg"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="w-full sm:w-auto py-3 rounded-lg"
            loading={isPending}
            disabled={isPending}
          >
            Create Board
          </Button>
        </div>
      </form>
    </Modal>
  );
}