"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type ToastVariant = "success" | "error" | "info";

type ToastItem = {
  id: string;
  title: string;
  message?: string;
  variant: ToastVariant;
};

type ToastInput = {
  title: string;
  message?: string;
  variant?: ToastVariant;
};

type ToastContextValue = {
  pushToast: (input: ToastInput) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

function ToastCard({ toast, onClose }: { toast: ToastItem; onClose: () => void }) {
  const colorClass =
    toast.variant === "success"
      ? "border-emerald-400/40 bg-emerald-500/10"
      : toast.variant === "error"
        ? "border-rose-400/40 bg-rose-500/10"
        : "border-[#d6b36a]/40 bg-[#d6b36a]/10";

  return (
    <div className={`w-full rounded-xl border p-4 shadow-2xl backdrop-blur ${colorClass}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[#f8ecd0]">{toast.title}</p>
          {toast.message ? <p className="mt-1 text-xs text-[#e2d3b0]">{toast.message}</p> : null}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-[#d6b36a]/30 px-2 py-1 text-xs text-[#f0dca7] hover:border-[#d6b36a]"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const pushToast = useCallback((input: ToastInput) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const nextToast: ToastItem = {
      id,
      title: input.title,
      message: input.message,
      variant: input.variant ?? "info",
    };

    setToasts((current) => [nextToast, ...current].slice(0, 3));

    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 2600);
  }, []);

  const value = useMemo<ToastContextValue>(() => ({ pushToast }), [pushToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-20 z-[90] w-[min(360px,calc(100vw-2rem))] space-y-2">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastCard toast={toast} onClose={() => setToasts((current) => current.filter((item) => item.id !== toast.id))} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return context;
}
