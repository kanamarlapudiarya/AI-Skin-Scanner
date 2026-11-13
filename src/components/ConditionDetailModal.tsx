import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  AlertTriangle,
  AlertOctagon,
  Clock,
  MapPin,
  Eye,
  ShieldCheck,
  Stethoscope,
  Sparkles,
  ArrowRight,
  Info,
  CheckCircle2,
} from 'lucide-react'
import { useScanStore } from '@/store/useScanStore'
import { getConditionById, getLookalikeConditions, Condition } from '@/data/conditions'

export const ConditionDetailModal: React.FC = () => {
  const { selectedConditionId, setSelectedConditionId } = useScanStore()

  const condition: Condition | undefined = selectedConditionId
    ? getConditionById(selectedConditionId)
    : undefined

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedConditionId(null)
      }
    }
    if (selectedConditionId) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [selectedConditionId, setSelectedConditionId])

  if (!condition) return null

  const isUrgentOrCancer =
    condition.severity === 'urgent' || condition.category === 'precancerous-and-cancer'

  const lookalikes = getLookalikeConditions(condition)

  const getSeverityBadge = (severity: Condition['severity']) => {
    switch (severity) {
      case 'urgent':
        return {
          label: 'URGENT EVALUATION',
          className: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30',
        }
      case 'severe':
        return {
          label: 'SEVERE',
          className: 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30',
        }
      case 'moderate':
        return {
          label: 'MODERATE',
          className: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
        }
      case 'mild':
      default:
        return {
          label: 'MILD / BENIGN',
          className: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
        }
    }
  }

  const severityBadge = getSeverityBadge(condition.severity)

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedConditionId(null)}
          className="fixed inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl glass-panel bg-white/95 dark:bg-[#150F38]/95 border border-white/80 dark:border-white/10 shadow-2xl p-6 sm:p-8 z-10 space-y-6"
        >
          {/* Close Button */}
          <button
            onClick={() => setSelectedConditionId(null)}
            className="absolute top-5 right-5 p-2 rounded-2xl bg-surface-2/80 hover:bg-surface-2 dark:bg-white/10 dark:hover:bg-white/20 text-text-muted hover:text-text transition-colors border border-border"
            aria-label="Close condition guide"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Urgent / Cancer Warning Banner */}
          {isUrgentOrCancer && (
            <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-start gap-3 text-red-950 dark:text-red-200 shadow-sm animate-pulse-subtle">
              <AlertOctagon className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <strong className="font-heading font-extrabold text-sm text-red-700 dark:text-red-300 block">
                  High Clinical Priority · Professional In-Person Evaluation Required
                </strong>
                <p className="leading-relaxed">
                  This condition carries significant clinical priority or requires histological biopsy. Do not rely on home self-care or automated classification. Prompt in-person evaluation by a board-certified dermatologist or physician is strongly indicated.
                </p>
              </div>
            </div>
          )}

          {/* Header Info */}
          <div className="space-y-3 pr-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-500/10 text-primary dark:text-primary-light border border-primary/20">
                Category: {condition.category.replace(/-/g, ' ').toUpperCase()}
              </span>

              {condition.icd10 && (
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-surface-2 dark:bg-white/10 border border-border text-text-muted">
                  ICD-10: {condition.icd10}
                </span>
              )}

              <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${severityBadge.className}`}>
                {severityBadge.label}
              </span>

              <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-semibold border ${
                condition.contagious
                  ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30'
                  : 'bg-teal-500/15 text-teal dark:text-teal-300 border-teal-500/30'
              }`}>
                {condition.contagious ? '⚡ Contagious' : '✓ Non-Contagious'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-text tracking-tight">
              {condition.name}
            </h2>

            {condition.aliases.length > 0 && (
              <p className="text-xs text-text-muted font-mono">
                Also known as: <span className="text-text font-medium">{condition.aliases.join(', ')}</span>
              </p>
            )}

            <p className="text-sm text-text-body leading-relaxed pt-1">
              {condition.description}
            </p>
          </div>

          {/* Clinical Profile Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Typical Appearance */}
            <div className="p-4.5 rounded-2xl bg-surface-2/60 dark:bg-white/5 border border-border/80 space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-text flex items-center gap-2">
                <Eye className="w-3.5 h-3.5 text-primary" />
                Typical Appearance
              </h4>
              <ul className="space-y-1.5 text-xs text-text-body">
                {condition.typicalAppearance.map((app, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary font-bold mt-0.5">•</span>
                    <span>{app}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Common Locations & Duration */}
            <div className="p-4.5 rounded-2xl bg-surface-2/60 dark:bg-white/5 border border-border/80 space-y-3">
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-text flex items-center gap-2 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-pink" />
                  Common Anatomical Locations
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {condition.commonLocations.map((loc, idx) => (
                    <span key={idx} className="px-2.5 py-0.5 rounded-lg text-xs bg-white/80 dark:bg-white/10 border border-border text-text font-medium">
                      {loc}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-border/50 flex items-center gap-2 text-xs">
                <Clock className="w-3.5 h-3.5 text-teal shrink-0" />
                <span className="text-text-muted">Duration:</span>
                <span className="font-semibold text-text">{condition.typicalDuration}</span>
              </div>
            </div>
          </div>

          {/* Red Flags Callout Box */}
          {condition.redFlags.length > 0 && (
            <div className="p-5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/25 space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber" />
                Red Flags — Seek Clinical Attention Soon
              </h4>
              <ul className="space-y-1.5 text-xs text-amber-950 dark:text-amber-100">
                {condition.redFlags.map((flag, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber font-bold mt-0.5">⚠️</span>
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* When to See a Doctor */}
          <div className="p-4.5 rounded-2xl bg-indigo-500/5 dark:bg-white/5 border border-indigo-500/20 flex items-start gap-3">
            <Stethoscope className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <strong className="font-heading font-bold text-text block">
                When to See a Doctor
              </strong>
              <p className="text-text-body leading-relaxed">
                {condition.whenToSeeDoctor}
              </p>
            </div>
          </div>

          {/* Self-Care & Supportive Tips */}
          {condition.selfCare.length > 0 && (
            <div className="p-5 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/25 space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Supportive Non-Prescriptive Self-Care Tips
              </h4>
              <ul className="space-y-1.5 text-xs text-emerald-950 dark:text-emerald-100">
                {condition.selfCare.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Similar Conditions / Lookalikes */}
          {lookalikes.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-border/80">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-text flex items-center justify-between">
                <span>Similar Conditions & Lookalikes</span>
                <span className="text-text-muted font-normal">Click to switch view</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {lookalikes.map((lookalike) => (
                  <div
                    key={lookalike.id}
                    onClick={() => setSelectedConditionId(lookalike.id)}
                    className="p-3.5 rounded-2xl bg-surface-2/60 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-border hover:border-primary/40 cursor-pointer transition-all flex items-center justify-between group shadow-xs"
                  >
                    <div>
                      <span className="font-heading font-bold text-xs text-text group-hover:text-primary transition-colors block">
                        {lookalike.name}
                      </span>
                      <span className="text-[11px] font-mono text-text-muted">
                        {lookalike.category.replace(/-/g, ' ')}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Persistent Disclaimer */}
          <div className="pt-4 border-t border-border/80 flex items-start gap-2.5 text-[11px] text-text-muted leading-relaxed">
            <Info className="w-4 h-4 text-amber shrink-0 mt-0.5" />
            <span>
              <strong>Educational Reference Only:</strong> This guide provides general dermatological information and does not constitute medical diagnosis, treatment, or formal clinical advice. If you suspect an infection, malignancy, or acute allergic reaction, consult a licensed physician or board-certified dermatologist immediately.
            </span>
          </div>

          {/* Modal Footer Close Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => setSelectedConditionId(null)}
              className="px-6 py-2.5 rounded-2xl text-xs font-semibold bg-surface-2 hover:bg-border text-text transition-colors"
            >
              Close Guide
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
