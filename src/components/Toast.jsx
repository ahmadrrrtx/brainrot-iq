import { useState, useEffect, createContext, useContext, useCallback } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const icons = {
    success: "✅",
    error: "❌",
    info: "ℹ️",
    warning: "⚠️",
  };

  const colors = {
    success: "border-green-500/40 bg-green-500/10 text-green-300",
    error: "border-red-500/40 bg-red-500/10 text-red-300",
    info: "border-purple-500/40 bg-purple-500/10 text-purple-300",
    warning: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  };

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border backdrop-blur-md text-sm font-medium shadow-lg animate-fade-up min-w-[200px] max-w-sm text-center justify-center ${
              colors[toast.type]
            }`}
          >
            <span>{icons[toast.type]}</span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be inside ToastProvider");
  return ctx;
};
