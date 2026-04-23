"use client";

type Props = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Yes",
  cancelText = "No",
  loading = false,
  onConfirm,
  onCancel,
}: Props) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md rounded-2xl border border-[#d6b36a]/30 bg-[#130e0a] p-6 shadow-2xl">
        <h3 className="text-2xl font-bold text-[#f5e6c2]">{title}</h3>
        <p className="mt-2 text-sm text-[#dccba6]">{message}</p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-md border border-[#d6b36a]/40 px-4 py-2 text-sm font-semibold text-[#f0dca7] hover:border-[#d6b36a] disabled:opacity-60"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-md bg-rose-500/80 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-500 disabled:opacity-60"
          >
            {loading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
