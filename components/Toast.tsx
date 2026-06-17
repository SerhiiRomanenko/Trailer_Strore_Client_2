import React, { createContext, useContext, useState, useCallback, useRef, ReactNode } from "react";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
}

interface ToastContextType {
  toast: (options: Omit<Toast, "id">) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  remove: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

const toastIcons = {
  success: <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />,
  error: <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />,
  info: <Info className="h-4 w-4 text-blue-500 flex-shrink-0" />,
  warning: <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const toast = useCallback(
    (options: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { ...options, id }]);
      const timer = setTimeout(() => remove(id), 4000);
      timers.current.set(id, timer);
    },
    [remove]
  );

  const success = useCallback(
    (message: string, title?: string) => toast({ type: "success", title, message }),
    [toast]
  );
  const error = useCallback(
    (message: string, title?: string) => toast({ type: "error", title, message }),
    [toast]
  );
  const info = useCallback(
    (message: string, title?: string) => toast({ type: "info", title, message }),
    [toast]
  );
  const warning = useCallback(
    (message: string, title?: string) => toast({ type: "warning", title, message }),
    [toast]
  );

  return (
    <ToastContext.Provider value={{ toast, success, error, info, warning, remove }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="animate-toast-in bg-[var(--color-surface)] rounded-lg shadow-[var(--shadow-lg)] border border-[var(--color-border)] p-3 flex items-start gap-3"
          >
            {toastIcons[t.type]}
            <div className="flex-1 min-w-0">
              {t.title && <p className="text-sm font-medium text-[var(--color-text)]">{t.title}</p>}
              <p className="text-xs text-[var(--color-text-secondary)]">{t.message}</p>
            </div>
            <button
              onClick={() => remove(t.id)}
              className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text)] transition-colors p-0.5"
              aria-label="Закрити"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}

// Global alert/confirm replacements
const originalAlert = window.alert;
const originalConfirm = window.confirm;

let toastOverride = false;
export function enableToastOverrides() {
  toastOverride = true;
  window.alert = (message) => {
    const ctx = useContext(ToastContext);
    if (ctx) {
      ctx.info(message);
    } else {
      originalAlert(message);
    }
  };
  window.confirm = (message) => {
    return originalConfirm(message);
  };
}
