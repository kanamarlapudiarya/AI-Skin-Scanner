import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { useScanStore } from '@/store/useScanStore'

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useScanStore()

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-lg shadow-card border text-sm font-medium ${
              toast.type === 'success'
                ? 'bg-surface text-text border-risk-low/30'
                : toast.type === 'error'
                ? 'bg-surface text-text border-risk-high/30'
                : 'bg-surface text-text border-primary/30'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {toast.type === 'success' && (
                <CheckCircle2 className="w-4 h-4 text-risk-low flex-shrink-0" />
              )}
              {toast.type === 'error' && (
                <AlertCircle className="w-4 h-4 text-risk-high flex-shrink-0" />
              )}
              {toast.type === 'info' && (
                <Info className="w-4 h-4 text-primary flex-shrink-0" />
              )}
              <span className="text-xs sm:text-sm text-text font-normal">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-muted hover:text-text p-1 rounded transition-colors"
              aria-label="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
