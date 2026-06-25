import type {ConfirmDialogProps} from "../../types";

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

      <div className="
        w-full max-w-md
        rounded-2xl
        bg-white dark:bg-slate-900
        border border-slate-200 dark:border-slate-700
        shadow-xl
        p-6
      ">

        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          {title}
        </h2>

        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          {message}
        </p>

        <div className="mt-6 flex justify-end gap-3">

          <button
            onClick={onCancel}
            className="
              px-4 py-2
              rounded-lg
              border
              border-slate-300
              dark:border-slate-700
              text-slate-700
              dark:text-slate-300
            "
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className="
              px-4 py-2
              rounded-lg
              bg-red-600
              hover:bg-red-700
              text-white
            "
          >
            {confirmText}
          </button>

        </div>

      </div>

    </div>
  )
}