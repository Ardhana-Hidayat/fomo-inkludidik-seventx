'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info') => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const newItem: ToastItem = { id, type, message };

      setToasts((prev) => [...prev.slice(-3), newItem]); // Batasi maksimal 4 toast bersamaan

      setTimeout(() => {
        removeToast(id);
      }, 4000); // 4 detik
    },
    [removeToast]
  );

  const success = useCallback((msg: string) => showToast(msg, 'success'), [showToast]);
  const error = useCallback((msg: string) => showToast(msg, 'error'), [showToast]);
  const info = useCallback((msg: string) => showToast(msg, 'info'), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info }}>
      {children}

      {/* Kontainer Notifikasi Toast Global (Fixed Top-Right) */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2.5 px-4 sm:bottom-6 sm:right-6 sm:px-0"
      >
        {toasts.map((t) => {
          let borderClass = 'border-border-strong';
          let bgClass = 'bg-surface';
          let IconComponent = Info;
          let iconColor = 'text-brand';

          if (t.type === 'success') {
            borderClass = 'border-emerald-600';
            bgClass = 'bg-white';
            IconComponent = CheckCircle2;
            iconColor = 'text-emerald-700';
          } else if (t.type === 'error') {
            borderClass = 'border-red-600';
            bgClass = 'bg-white';
            IconComponent = AlertCircle;
            iconColor = 'text-red-700';
          } else {
            borderClass = 'border-blue-600';
            bgClass = 'bg-white';
            IconComponent = Info;
            iconColor = 'text-blue-700';
          }

          return (
            <div
              key={t.id}
              role={t.type === 'error' ? 'alert' : 'status'}
              className={`pointer-events-auto flex items-center justify-between gap-3 rounded-2xl border-2 ${borderClass} ${bgClass} p-4 text-ink shadow-lg transition-all duration-150 motion-reduce:transition-none`}
            >
              <div className="flex items-center gap-3">
                <IconComponent className={`h-6 w-6 flex-shrink-0 ${iconColor}`} aria-hidden="true" />
                <p className="text-sm font-bold sm:text-base">{t.message}</p>
              </div>

              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-xl p-1 text-ink-muted hover:bg-surface-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                aria-label="Tutup notifikasi"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast harus digunakan di dalam ToastProvider');
  }
  return context;
}
