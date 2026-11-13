import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Sparkles, Activity } from 'lucide-react'
import { useScanStore } from '@/store/useScanStore'
import { Step1Upload } from '@/components/scan/Step1Upload'
import { Step2Context } from '@/components/scan/Step2Context'
import { Step3Review } from '@/components/scan/Step3Review'
import { AnalyzingSonar } from '@/components/scan/AnalyzingSonar'
import { ScanResultsView } from '@/components/scan/ScanResultsView'
import { ScanErrorView } from '@/components/scan/ScanErrorView'

const STEP_TITLES = {
  1: 'Upload Close-Up Photo',
  2: 'Add Anatomical Context & Symptoms',
  3: 'Review Clinical Input & Consent',
}

export const ScanStudio: React.FC = () => {
  const { status, step } = useScanStore()

  // Framer Motion slide variants for stepper
  const stepSlideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 30 : -30,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3 },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 30 : -30,
      opacity: 0,
      transition: { duration: 0.2 },
    }),
  }

  return (
    <section id="scan" className="py-16 md:py-24 relative">
      <div className="max-w-scan mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 dark:bg-white/10 backdrop-blur-md text-primary dark:text-primary-light border border-indigo-200/50 dark:border-indigo-500/20 text-xs font-mono font-medium mb-3 shadow-xs">
            <Activity className="w-3.5 h-3.5 text-primary" />
            <span>Classification Studio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-text tracking-tight">
            Scan Studio
          </h2>
          <p className="text-xs sm:text-sm text-text-muted mt-2 max-w-md mx-auto leading-relaxed">
            {status === 'idle'
              ? 'Complete the 3-step structured intake for AI pattern classification'
              : status === 'analyzing'
              ? 'Multi-layer visual and context evaluation in progress'
              : status === 'results'
              ? 'Classified skin lesion analysis report'
              : 'Skin analysis status'}
          </p>
        </div>

        {/* Main Studio Card with Glassmorphism & 24px radius */}
        <div className="rounded-card-24 glass-panel border border-white/80 dark:border-white/15 shadow-2xl overflow-hidden relative">
          
          {/* Coloured Top Accent Strip */}
          <div className="h-1.5 w-full bg-gradient-to-r from-teal-400 via-indigo-500 to-pink-500" />

          {/* Progress Header (Only visible in 'idle' wizard mode) */}
          {status === 'idle' && (
            <div className="p-5 sm:p-6 border-b border-border/60 bg-surface-2/40 dark:bg-white/5">
              
              {/* Stepper info row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-primary dark:text-primary-light uppercase tracking-wider block">
                    Step {step} of 3
                  </span>
                  <h3 className="text-base font-heading font-bold text-text">
                    {STEP_TITLES[step]}
                  </h3>
                </div>

                {/* 3-Dot Stepper */}
                <div className="flex items-center gap-3 self-start sm:self-auto">
                  {[1, 2, 3].map((s) => {
                    const isCompleted = step > s
                    const isActive = step === s
                    return (
                      <div key={s} className="flex items-center gap-1.5">
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-mono font-bold transition-all shadow-xs ${
                            isCompleted
                              ? 'bg-gradient-to-r from-teal to-emerald-500 text-white shadow-glowTeal'
                              : isActive
                              ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-glowPrimary ring-2 ring-primary/40 ring-offset-2 ring-offset-surface'
                              : 'bg-surface-2 dark:bg-white/10 border border-border text-text-muted'
                          }`}
                        >
                          {isCompleted ? <Check className="w-4 h-4 stroke-[2.5]" /> : s}
                        </div>
                        {s < 3 && (
                          <div
                            className={`w-6 h-0.5 rounded-full transition-colors ${
                              step > s ? 'bg-gradient-to-r from-teal to-primary' : 'bg-border/60'
                            }`}
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Thin Gradient Progress Bar */}
              <div className="w-full h-1.5 bg-border/40 dark:bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal via-primary to-pink transition-all duration-300 rounded-full shadow-sm"
                  style={{ width: `${(step / 3) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Dynamic Inner Content by Status */}
          <div className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {status === 'idle' && (
                <motion.div
                  key={`step-${step}`}
                  variants={stepSlideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  custom={step}
                >
                  {step === 1 && <Step1Upload />}
                  {step === 2 && <Step2Context />}
                  {step === 3 && <Step3Review />}
                </motion.div>
              )}

              {status === 'analyzing' && (
                <motion.div
                  key="status-analyzing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <AnalyzingSonar />
                </motion.div>
              )}

              {status === 'results' && (
                <motion.div
                  key="status-results"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <ScanResultsView />
                </motion.div>
              )}

              {status === 'error' && (
                <motion.div
                  key="status-error"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <ScanErrorView />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  )
}
