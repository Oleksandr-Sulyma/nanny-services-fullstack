"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CheckCircle2, Info, TriangleAlert, X, XCircle } from "lucide-react";

type ToastVariant = "success" | "error" | "info" | "warning";

type ToastInput = {
  title: string;
  description?: string;
  variant?: ToastVariant;
};

type Toast = ToastInput & {
  id: string;
  variant: ToastVariant;
};

type ToastContextValue = {
  showToast: (toast: ToastInput) => void;
  dismissToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const toastStyles: Record<
  ToastVariant,
  {
    className: string;
    icon: ReactNode;
  }
> = {
  success: {
    className: "border-green-200 bg-green-50 text-green-900",
    icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
  },
  error: {
    className: "border-red-200 bg-red-50 text-red-900",
    icon: <XCircle className="h-5 w-5 text-red-600" />,
  },
  info: {
    className: "border-blue-200 bg-blue-50 text-blue-900",
    icon: <Info className="h-5 w-5 text-blue-600" />,
  },
  warning: {
    className: "border-yellow-200 bg-yellow-50 text-yellow-900",
    icon: <TriangleAlert className="h-5 w-5 text-yellow-600" />,
  },
};

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return context;
}

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id),
    );
  }, []);

  const showToast = useCallback(
    ({ title, description, variant = "info" }: ToastInput) => {
      const id = crypto.randomUUID();

      setToasts((currentToasts) => [
        ...currentToasts,
        { id, title, description, variant },
      ]);

      window.setTimeout(() => {
        dismissToast(id);
      }, 4000);
    },
    [dismissToast],
  );

  const value = useMemo(
    () => ({
      showToast,
      dismissToast,
    }),
    [dismissToast, showToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="fixed right-4 bottom-4 z-100 flex w-[calc(100%_-_32px)] max-w-96 flex-col gap-3">
        {toasts.map((toast) => {
          const styles = toastStyles[toast.variant];

          return (
            <div
              key={toast.id}
              role="status"
              className={`flex gap-3 rounded-2xl border p-4 shadow-lg ${styles.className}`}
            >
              <div className="shrink-0">{styles.icon}</div>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{toast.title}</p>
                {toast.description && (
                  <p className="mt-1 text-sm opacity-80">
                    {toast.description}
                  </p>
                )}
              </div>
              <button
                type="button"
                aria-label="Dismiss notification"
                className="shrink-0 rounded-full transition-opacity hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-current"
                onClick={() => dismissToast(toast.id)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
