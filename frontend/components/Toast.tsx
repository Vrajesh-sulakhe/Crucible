"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertTriangle, Info, X, Zap } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  title: string;
  message?: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (title: string, message?: string, type?: ToastType) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (title: string, message?: string, type: ToastType = "info") => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: Toast = { id, title, message, type };
      setToasts((prev) => [...prev.slice(-4), newToast]); // Keep at most 5

      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  const success = useCallback((title: string, message?: string) => showToast(title, message, "success"), [showToast]);
  const error = useCallback((title: string, message?: string) => showToast(title, message, "error"), [showToast]);
  const info = useCallback((title: string, message?: string) => showToast(title, message, "info"), [showToast]);
  const warning = useCallback((title: string, message?: string) => showToast(title, message, "warning"), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
      {children}
      {/* Toast Overlay Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full font-mono">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-lg border backdrop-blur-xl shadow-2xl flex items-start justify-between gap-3 transition-all transform animate-in slide-in-from-bottom-3 duration-200 ${
              toast.type === "success"
                ? "bg-surface-1/95 border-emerald-500/60 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                : toast.type === "error"
                ? "bg-surface-1/95 border-rose-500/60 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.15)]"
                : toast.type === "warning"
                ? "bg-surface-1/95 border-amber-500/60 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.15)]"
                : "bg-surface-1/95 border-cyan-500/60 text-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.15)]"
            }`}
          >
            <div className="flex items-start gap-2.5">
              {toast.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
              {toast.type === "error" && <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
              {toast.type === "warning" && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />}
              {toast.type === "info" && <Zap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />}
              <div>
                <p className="text-xs font-bold tracking-tight text-white">{toast.title}</p>
                {toast.message && <p className="text-[11px] text-slate-300 mt-0.5 font-sans leading-tight">{toast.message}</p>}
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition-colors p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
