"use client";

import { createContext, useCallback, useContext, useState } from "react";

type ToastType = "success" | "error";

type ToastState = {
  message: string;
  type: ToastType;
  visible: boolean;
};

type ToastContextValue = {
  toast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ToastState>({
    message: "",
    type: "success",
    visible: false,
  });

  const show = useCallback((message: string, type: ToastType = "success") => {
    setState({ message, type, visible: true });
    const t = setTimeout(() => {
      setState((s) => ({ ...s, visible: false }));
    }, 2500);
    return () => clearTimeout(t);
  }, []);

  const value: ToastContextValue = {
    toast: show,
    success: (msg) => show(msg, "success"),
    error: (msg) => show(msg, "error"),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastDisplay {...state} />
    </ToastContext.Provider>
  );
}

function ToastDisplay({ message, type, visible }: ToastState) {
  if (!visible || !message) return null;
  const isSuccess = type === "success";
  return (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] animate-toast-in"
      role="alert"
    >
      <div
        className={`px-5 py-3 rounded-lg shadow-lg text-white text-sm font-medium min-w-[200px] text-center ${
          isSuccess
            ? "bg-emerald-600"
            : "bg-rose-600"
        }`}
      >
        {message}
      </div>
    </div>
  );
}
