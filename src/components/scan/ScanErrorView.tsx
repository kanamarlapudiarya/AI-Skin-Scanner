import React, { useState, useEffect } from 'react'
import { AlertCircle, RefreshCw, Image, Sun, Camera, Sparkles, Clock, ArrowLeft } from 'lucide-react'
import { useScanStore } from '@/store/useScanStore'

export const ScanErrorView: React.FC = () => {
  const { error, setStep, setStatus, startAnalysis } = useScanStore()
  const [countdown, setCountdown] = useState(error?.retryAfterSeconds || 30)

  // Rate limit countdown timer
  useEffect(() => {
    if (error?.type === 'RATE_LIMIT' && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => Math.max(0, prev - 1))
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [error, countdown])

  const handleRetry = () => {
    startAnalysis()
  }

  const handleChangePhoto = () => {
    setStatus('idle')
    setStep(1)
  }

  const isRateLimit = error?.type === 'RATE_LIMIT'
  const isNotSkin = error?.type === 'NOT_SKIN_IMAGE'

  return (
    <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/80 dark:border-white/10 shadow-lg max-w-xl mx-auto space-y-6 text-center">
      
      {/* Icon with soft glowing ring */}
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-risk-high flex items-center justify-center mx-auto border border-red-500/20 shadow-sm">
        <AlertCircle className="w-8 h-8" />
      </div>

      {/* Title & Plain-Language Explanation */}
      <div className="space-y-2">
        <h4 className="text-xl font-heading font-extrabold text-text">
          {error?.title || 'Analysis Incomplete'}
        </h4>
        <p className="text-xs sm:text-sm text-text-body leading-relaxed">
          {error?.message || 'We could not complete the skin lesion classification. Please review the guidance below.'}
        </p>
      </div>

      {/* Special Guidance: Not a Skin Image */}
      {isNotSkin && (
        <div className="p-5 rounded-2xl bg-white/70 dark:bg-white/5 border border-border text-left space-y-3 shadow-xs">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted block">
            Tips for Capturing Recognizable Skin Lesions
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-text-body">
            <div className="flex items-start gap-2.5">
              <Camera className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>Center the rash or lesion clearly in the viewfinder</span>
            </div>
            <div className="flex items-start gap-2.5">
              <Sun className="w-4 h-4 text-amber shrink-0 mt-0.5" />
              <span>Use bright daylight; avoid strong flash reflections</span>
            </div>
            <div className="flex items-start gap-2.5">
              <Image className="w-4 h-4 text-teal shrink-0 mt-0.5" />
              <span>Ensure the photo is not of clothing, scenery, or objects</span>
            </div>
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-pink shrink-0 mt-0.5" />
              <span>Hold camera steady 10–20 cm away to prevent blur</span>
            </div>
          </div>
        </div>
      )}

      {/* Special Guidance: Rate Limit Countdown */}
      {isRateLimit && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-center gap-2 font-mono">
          <Clock className="w-4 h-4 text-amber" />
          <span>Retry available in {countdown}s</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
        <button
          onClick={handleChangePhoto}
          className="px-6 py-3 rounded-2xl text-xs font-semibold bg-white/70 hover:bg-white dark:bg-white/10 dark:hover:bg-white/15 text-text border border-border transition-colors flex items-center gap-2 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Change photo</span>
        </button>

        <button
          onClick={handleRetry}
          disabled={isRateLimit && countdown > 0}
          className={`px-7 py-3 rounded-2xl text-xs font-semibold shadow-sm transition-all flex items-center gap-2 ${
            isRateLimit && countdown > 0
              ? 'bg-surface-2 dark:bg-white/10 text-text-muted cursor-not-allowed opacity-60'
              : 'bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white cursor-pointer shadow-glowPrimary hover:shadow-glowPrimaryHover hover:-translate-y-0.5'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          <span>{isRateLimit && countdown > 0 ? `Wait (${countdown}s)` : 'Try again'}</span>
        </button>
      </div>

    </div>
  )
}
