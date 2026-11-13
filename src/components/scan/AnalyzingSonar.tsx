import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useScanStore } from '@/store/useScanStore'
import { X } from 'lucide-react'

const CYCLING_MESSAGES = [
  'Identifying visual patterns…',
  'Mapping lesion characteristics…',
  'Calculating risk and confidence…',
  'Identifying other possibilities…',
  'Preparing your report…',
]

export const AnalyzingSonar: React.FC = () => {
  const { formData, cancelAnalysis } = useScanStore()
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % CYCLING_MESSAGES.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="py-12 px-6 flex flex-col items-center justify-center text-center max-w-lg mx-auto">
      
      {/* Signature Sonar Scan Container */}
      <div className="relative w-52 h-52 flex items-center justify-center mb-8">
        
        {/* Ring 1 (delay 0ms) */}
        <div
          className="absolute inset-0 rounded-full border-2 border-indigo-500/50 sonar-ring-1 pointer-events-none"
          style={{ backgroundColor: 'rgba(99, 102, 241, 0.14)' }}
        />

        {/* Ring 2 (delay 600ms) */}
        <div
          className="absolute inset-0 rounded-full border-2 border-purple-500/50 sonar-ring-2 pointer-events-none"
          style={{ backgroundColor: 'rgba(139, 92, 246, 0.14)' }}
        />

        {/* Ring 3 (delay 1200ms) */}
        <div
          className="absolute inset-0 rounded-full border-2 border-pink-500/50 sonar-ring-3 pointer-events-none"
          style={{ backgroundColor: 'rgba(236, 72, 153, 0.12)' }}
        />

        {/* Center Image (160px) */}
        <div className="relative z-10 w-40 h-40 rounded-full overflow-hidden border-4 border-white dark:border-[#1a1444] shadow-2xl ring-4 ring-indigo-500/30 bg-surface">
          <img
            src={formData.imagePreviewUrl || formData.imageBase64 || ''}
            alt="Skin being analyzed"
            className="w-full h-full object-cover"
          />
          {/* Subtle scanning sweep overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/25 via-pink-500/10 to-transparent opacity-70 animate-pulse pointer-events-none" />
        </div>
      </div>

      {/* Cycling Status Text */}
      <div className="h-8 mb-2 flex items-center justify-center">
        <motion.p
          key={currentMessageIndex}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.3 }}
          className="text-base sm:text-lg font-heading font-extrabold text-text"
        >
          {CYCLING_MESSAGES[currentMessageIndex]}
        </motion.p>
      </div>

      {/* Indeterminate Gradient Bar (teal -> indigo -> pink) */}
      <div className="w-64 h-2 bg-surface-2 dark:bg-white/10 rounded-full overflow-hidden border border-border/80 my-3 relative shadow-inner">
        <motion.div
          className="h-full bg-gradient-to-r from-teal via-primary to-pink rounded-full shadow-glowPrimary"
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.6,
            ease: 'easeInOut',
          }}
          style={{ width: '50%' }}
        />
      </div>

      {/* Time Notice */}
      <p className="text-xs font-mono text-text-muted mb-6">
        Usually 5–15 seconds
      </p>

      {/* Abort Cancel Button */}
      <button
        onClick={cancelAnalysis}
        className="px-5 py-2.5 rounded-2xl text-xs font-semibold text-text-body hover:text-text-heading bg-white/70 hover:bg-white dark:bg-white/10 dark:hover:bg-white/15 border border-border shadow-xs hover:border-pink-300 transition-all flex items-center gap-1.5"
      >
        <X className="w-3.5 h-3.5" />
        <span>Cancel analysis</span>
      </button>

    </div>
  )
}
