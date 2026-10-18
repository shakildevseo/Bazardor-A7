"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { Toaster, toast } from "react-hot-toast";

type ToastType = "success" | "error";

type ToastContextValue = {
  showToast: (message: string, type: ToastType) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  function showToast(message: string, type: ToastType) {
    toast[type](message, { id: `${type}:${message}` });
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          success: { style: { background: "#087b4b", color: "#fff" } },
          error: { style: { background: "#b9382e", color: "#fff" } },
        }}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider.");
  }
  return context.showToast;
}