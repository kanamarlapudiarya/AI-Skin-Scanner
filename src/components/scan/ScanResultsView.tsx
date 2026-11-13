import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  BookmarkCheck,
  RotateCcw,
  Download,
  Stethoscope,
  ExternalLink,
  Info,
  Clock,
  CheckCircle2,
  XCircle,
  Activity,
  BookOpen,
  ArrowRight,
  AlertOctagon,
} from 'lucide-react'
import { useScanStore } from '@/store/useScanStore'
import { RiskLevel, DoctorUrgency, ActionPriority } from '@/types'
import { CONDITIONS } from '@/data/conditions'

export const ScanResultsView: React.FC = () => {
  const {
    result,
    formData,
    isSavedToHistory,
    saveCurrentResultToHistory,
    resetToNewScan,
    addToast,
    setSelectedConditionId,
  } = useScanStore()

  const [isSaving, setIsSaving] = useState(false)
  const [showConfirmReset, setShowConfirmReset] = useState(false)
  const [animatedConfidence, setAnimatedConfidence] = useState(0)

  if (!result) return null

  const primaryCondition = CONDITIONS.find(
    c => c.name.toLowerCase() === result.classification.toLowerCase() ||
         c.id.toLowerCase() === result.classification.toLowerCase().replace(/\s+/g, '-')
  )

  const isUrgentOrCancer =
    result.risk_level === 'high' ||
    result.see_doctor_urgency === 'urgent' ||
    Boolean(primaryCondition && (primaryCondition.severity === 'urgent' || primaryCondition.category === 'precancerous-and-cancer'))

  // Animate confidence ring (0 -> value, 1.2s)
  useEffect(() => {
    let startTimestamp: number | null = null
    const duration = 1200
    const target = result.confidence || 0

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      setAnimatedConfidence(Math.round(progress * target))
      if (progress < 1) {
        window.requestAnimationFrame(step)
      }
    }
    window.requestAnimationFrame(step)
  }, [result.confidence])

  const getRiskBorderColor = (risk: RiskLevel) => {
    switch (risk) {
      case 'low':
        return 'border-l-teal'
      case 'high':
        return 'border-l-risk-high'
      case 'moderate':
      default:
        return 'border-l-amber'
    }
  }

  const getRiskBadge = (risk: RiskLevel) => {
    switch (risk) {
      case 'low':
        return {
          text: 'LOW RISK',
          className: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
        }
      case 'high':
        return {
          text: 'HIGH RISK',
          className: 'bg-red-500/15 text-risk-high border-red-500/30',
        }
      case 'moderate':
      default:
        return {
          text: 'MODERATE RISK',
          className: 'bg-gradient-to-r from-amber-500 to-pink text-white shadow-sm shadow-pink/25',
        }
    }
  }

  const getPriorityDot = (priority: ActionPriority) => {
    switch (priority) {
      case 'immediate':
        return { color: 'bg-risk-high', label: 'Do now' }
      case 'soon':
        return { color: 'bg-amber', label: 'Within a week' }
      case 'routine':
      default:
        return { color: 'bg-teal', label: 'When convenient' }
    }
  }

  const getDoctorUrgencyInfo = (urgency: DoctorUrgency) => {
    switch (urgency) {
      case 'emergency':
        return {
          title: 'Immediate Emergency Care Recommended',
          bg: 'bg-red-500/10 border-red-500/30 text-red-950 dark:text-red-200',
          badgeBg: 'bg-red-600 text-white',
          label: 'EMERGENCY',
        }
      case 'urgent':
        return {
          title: 'Prompt Clinical Evaluation Advised (within 24-48 hours)',
          bg: 'bg-red-500/10 border-red-500/30 text-red-900 dark:text-red-200',
          badgeBg: 'bg-risk-high text-white',
          label: 'URGENT',
        }
      case 'within_week':
        return {
          title: 'Consult a Dermatologist within 1–2 Weeks',
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-950 dark:text-amber-200',
          badgeBg: 'bg-amber text-white',
          label: 'SOON',
        }
      case 'routine':
      default:
        return {
          title: 'Routine Dermatological Consultation',
          bg: 'bg-indigo-500/10 dark:bg-white/5 border-indigo-500/20 text-text-heading',
          badgeBg: 'bg-primary text-white',
          label: 'ROUTINE',
        }
    }
  }

  const handleSave = async () => {
    if (isSaving || isSavedToHistory) return
    setIsSaving(true)
    await saveCurrentResultToHistory()
    setIsSaving(false)
  }

  const handleDownloadTxt = () => {
    const content = `=====================================================
AI SKIN SCANNER: LOCALIZED SKIN CLASSIFICATION REPORT
Simulated Analysis — For Educational Use Only
=====================================================

Classification: ${result.classification}
ICD-10 Code:    ${result.icd_code}
Risk Level:     ${result.risk_level.toUpperCase()}
Confidence:     ${result.confidence}%
Analyzed At:    ${result.analyzed_at || new Date().toISOString()}

ANATOMICAL CONTEXT:
-------------------
Location:       ${formData.bodyLocation || 'Unspecified'}
Duration:       ${formData.duration || 'Unspecified'}
Symptoms:       ${formData.symptoms.join(', ') || 'None reported'}
Patient Notes:  ${formData.notes || 'None'}

CLINICAL DESCRIPTION & MORPHOLOGY:
----------------------------------
Description:    ${result.clinical_description}
Primary Lesion: ${result.morphology.primary_lesion}
Color:          ${result.morphology.color}
Border:         ${result.morphology.border}
Surface:        ${result.morphology.surface}
Distribution:   ${result.morphology.distribution}

RECOMMENDED ACTIONS:
--------------------
${result.recommended_actions.map((a, i) => `${i + 1}. [${a.priority.toUpperCase()}] ${a.action}`).join('\n')}

DIFFERENTIAL CONSIDERATIONS:
----------------------------
${result.differential_diagnoses.map((d, i) => `${i + 1}. ${d.name} (${d.likelihood}) - ${d.distinguishing}`).join('\n')}

SELF-CARE RECOMMENDATIONS:
--------------------------
${result.self_care_tips.map((s, i) => `• ${s}`).join('\n')}

WHAT TO AVOID:
--------------
${result.avoid.map((a, i) => `• ${a}`).join('\n')}

DOCTOR CONSULTATION URGENCY:
----------------------------
Level:          ${result.see_doctor_urgency.toUpperCase()}
Reason:         ${result.see_doctor_reason}

DISCLAIMER:
-----------
${result.disclaimer}
`
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `AISkinScanner_${result.classification.replace(/\s+/g, '_')}_Report.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    addToast('Report downloaded', 'success')
  }

  const handleNewScanClick = () => {
    if (!isSavedToHistory) {
      setShowConfirmReset(true)
    } else {
      resetToNewScan()
    }
  }

  const urgencyInfo = getDoctorUrgencyInfo(result.see_doctor_urgency)
  const riskBadge = getRiskBadge(result.risk_level)

  const staggerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  }

  return (
    <motion.div
      variants={staggerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-20 sm:pb-6"
    >
      {/* Confirmation Dialog for Unsaved Reset */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel rounded-3xl max-w-sm w-full p-6 border border-white/80 dark:border-white/10 shadow-modal space-y-4">
            <h4 className="font-heading font-extrabold text-base text-text">
              Start a new scan?
            </h4>
            <p className="text-xs text-text-body leading-relaxed">
              This report has not been saved to your session history. Are you sure you want to discard it?
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-surface-2 hover:bg-border text-text transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowConfirmReset(false)
                  resetToNewScan()
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-risk-high hover:bg-red-700 text-white transition-colors"
              >
                Discard & Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* A. Classification Hero */}
      <motion.div
        variants={cardVariants}
        className={`p-6 sm:p-7 rounded-3xl glass-panel border border-white/80 dark:border-white/10 shadow-md border-l-8 ${getRiskBorderColor(
          result.risk_level
        )}`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
              SIMULATED ANALYSIS
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono text-primary dark:text-primary-light bg-indigo-500/10 border border-indigo-500/20 font-semibold">
              ICD-10: {result.icd_code}
            </span>
          </div>
          <span
            className={`px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${riskBadge.className}`}
          >
            {riskBadge.text}
          </span>
        </div>

        {/* Urgent / Cancer Banner */}
        {isUrgentOrCancer && (
          <div className="my-3 p-3.5 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center gap-2.5 text-red-950 dark:text-red-200 text-xs shadow-xs">
            <AlertOctagon className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
            <span>
              <strong className="text-red-600 dark:text-red-400">High Clinical Priority:</strong> This condition requires in-person medical evaluation by a licensed physician or dermatologist.
            </span>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 my-4">
          <div className="space-y-2 max-w-lg">
            <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-text tracking-tight">
              {result.classification}
            </h3>
            <p className="text-xs sm:text-sm text-text-body leading-relaxed">
              {result.risk_summary}
            </p>

            {primaryCondition && (
              <button
                onClick={() => setSelectedConditionId(primaryCondition.id)}
                className="mt-2 px-3.5 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-primary dark:text-primary-light border border-indigo-500/25 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs group"
              >
                <BookOpen className="w-3.5 h-3.5 text-primary" />
                <span>View full {primaryCondition.name} guide</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}
          </div>

          {/* Animated SVG Confidence Ring */}
          <div className="flex items-center gap-4 bg-white/70 dark:bg-white/5 p-4 rounded-2xl border border-border/60 shrink-0 self-start md:self-auto shadow-xs">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-border/40"
                  strokeWidth="3.4"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-primary transition-all duration-300"
                  strokeDasharray={`${animatedConfidence}, 100`}
                  strokeWidth="3.4"
                  strokeLinecap="round"
                  stroke="url(#ringGrad)"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <defs>
                  <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#14B8A6" />
                    <stop offset="50%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="absolute text-xs font-mono font-bold text-text">
                {animatedConfidence}%
              </span>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-mono text-text-muted uppercase">Confidence</span>
              {isUrgentOrCancer ? (
                <span className="text-xs font-bold text-red-600 dark:text-red-400">
                  Needs Professional Evaluation
                </span>
              ) : (
                <span className="text-xs font-semibold text-text">AI Concordance</span>
              )}
            </div>
          </div>
        </div>

        {/* Meta Row */}
        <div className="mt-4 pt-4 border-t border-border/60 flex flex-wrap gap-4 text-xs font-mono text-text-muted">
          <span>Location: <strong className="text-text font-semibold">{formData.bodyLocation || 'General skin'}</strong></span>
          <span>·</span>
          <span>Duration: <strong className="text-text font-semibold">{formData.duration || 'Recorded'}</strong></span>
          <span>·</span>
          <span>Timestamp: <strong className="text-text font-semibold">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></span>
        </div>
      </motion.div>

      {/* B. Two columns: Clinical observation + morphology | Common causes + triggers */}
      <motion.div variants={cardVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Morphology Grid */}
        <div className="glass-panel rounded-3xl p-6 border border-white/80 dark:border-white/10 shadow-xs space-y-3.5">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            Clinical Morphology Analysis
          </h4>
          <p className="text-xs text-text-body leading-relaxed">
            {result.clinical_description}
          </p>

          <dl className="space-y-2 text-xs pt-3 border-t border-border/60">
            <div className="flex justify-between border-b border-border/40 pb-1.5">
              <dt className="text-text-muted">Primary Lesion:</dt>
              <dd className="font-semibold text-text text-right">{result.morphology.primary_lesion}</dd>
            </div>
            <div className="flex justify-between border-b border-border/40 pb-1.5">
              <dt className="text-text-muted">Coloration:</dt>
              <dd className="font-semibold text-text text-right">{result.morphology.color}</dd>
            </div>
            <div className="flex justify-between border-b border-border/40 pb-1.5">
              <dt className="text-text-muted">Border Margins:</dt>
              <dd className="font-semibold text-text text-right">{result.morphology.border}</dd>
            </div>
            <div className="flex justify-between border-b border-border/40 pb-1.5">
              <dt className="text-text-muted">Surface Scale/Texture:</dt>
              <dd className="font-semibold text-text text-right">{result.morphology.surface}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-muted">Distribution:</dt>
              <dd className="font-semibold text-text text-right">{result.morphology.distribution}</dd>
            </div>
          </dl>
        </div>

        {/* Common Causes & Triggers */}
        <div className="glass-panel rounded-3xl p-6 border border-white/80 dark:border-white/10 shadow-xs space-y-4">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted flex items-center gap-2">
            <Info className="w-4 h-4 text-pink" />
            Etiology & Identified Triggers
          </h4>
          
          <div>
            <span className="text-xs font-semibold text-text block mb-2">Common Causes:</span>
            <ul className="space-y-1.5">
              {result.common_causes.map((cause, i) => (
                <li key={i} className="text-xs text-text-body flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{cause}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-3 border-t border-border/60">
            <span className="text-xs font-semibold text-text block mb-2">Aggravating Factors & Triggers:</span>
            <div className="flex flex-wrap gap-1.5">
              {result.triggers.map((trigger, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-xs bg-white/70 dark:bg-white/10 border border-border text-text font-medium shadow-2xs"
                >
                  {trigger}
                </span>
              ))}
            </div>
          </div>
        </div>

      </motion.div>

      {/* C. Other Possible Conditions */}
      <motion.div variants={cardVariants} className="glass-panel rounded-3xl p-6 border border-white/80 dark:border-white/10 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted">
            Differential Considerations
          </h4>
          <span className="text-[11px] text-text-muted">Scroll horizontally</span>
        </div>

        <div className="flex gap-3.5 overflow-x-auto pb-2 scroll-smooth">
          {result.differential_diagnoses.map((diff, i) => {
            const diffCond = CONDITIONS.find(
              c => c.id === diff.conditionId ||
                   c.name.toLowerCase() === diff.name.toLowerCase() ||
                   c.name.toLowerCase().includes(diff.name.toLowerCase())
            )

            return (
              <div
                key={i}
                className="min-w-[250px] max-w-[290px] p-4 rounded-2xl border border-border bg-white/60 dark:bg-white/5 flex flex-col justify-between shrink-0 shadow-xs hover:shadow-sm transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-heading font-bold text-xs sm:text-sm text-text">
                      {diff.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-semibold bg-primary/10 text-primary border border-primary/20">
                      {diff.likelihood}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed">
                    {diff.distinguishing}
                  </p>
                </div>

                {diffCond && (
                  <button
                    onClick={() => setSelectedConditionId(diffCond.id)}
                    className="mt-3 pt-2 border-t border-border/50 text-[11px] font-semibold text-primary hover:text-primary-dark dark:text-primary-light flex items-center justify-between w-full group/btn"
                  >
                    <span>View condition guide</span>
                    <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* D. What to do next: Vertical Timeline */}
      <motion.div variants={cardVariants} className="glass-panel rounded-3xl p-6 border border-white/80 dark:border-white/10 shadow-xs space-y-4">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted flex items-center gap-2">
          <Clock className="w-4 h-4 text-teal" />
          Recommended Next Steps
        </h4>

        <div className="relative pl-6 space-y-5 border-l-2 border-border/80 ml-2">
          {result.recommended_actions.map((act, i) => {
            const pInfo = getPriorityDot(act.priority)
            return (
              <div key={i} className="relative group">
                {/* Timeline Dot */}
                <span
                  className={`absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full ring-4 ring-surface ${pInfo.color} shadow-sm`}
                />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted">
                      {pInfo.label}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-text leading-relaxed">
                    {act.action}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* E. Two Columns: Self-Care Tips (mint/emerald) | What to Avoid (rose/pink) */}
      <motion.div variants={cardVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Self Care Tips (Mint/Emerald tint) */}
        <div className="p-6 rounded-3xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/25 space-y-3.5">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Supportive Self-Care Guidelines
          </h4>
          <ul className="space-y-2">
            {result.self_care_tips.map((tip, i) => (
              <li key={i} className="text-xs text-emerald-950 dark:text-emerald-100 flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">✓</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* What to Avoid (Rose/Pink tint) */}
        <div className="p-6 rounded-3xl bg-rose-500/10 dark:bg-rose-500/15 border border-rose-500/25 space-y-3.5">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            Potential Aggravators to Avoid
          </h4>
          <ul className="space-y-2">
            {result.avoid.map((item, i) => (
              <li key={i} className="text-xs text-rose-950 dark:text-rose-100 flex items-start gap-2">
                <span className="text-rose-600 dark:text-rose-400 font-bold mt-0.5">✕</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

      </motion.div>

      {/* F. Doctor Urgency Banner */}
      <motion.div
        variants={cardVariants}
        className={`p-6 rounded-3xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${urgencyInfo.bg} shadow-xs`}
      >
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-white/80 dark:bg-white/10 shadow-xs shrink-0 text-primary">
            <Stethoscope className="w-5 h-5 text-primary" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${urgencyInfo.badgeBg}`}>
                {urgencyInfo.label}
              </span>
              <h5 className="font-heading font-bold text-sm text-text">
                {urgencyInfo.title}
              </h5>
            </div>
            <p className="text-xs text-text-body leading-relaxed max-w-xl">
              {result.see_doctor_reason}
            </p>
          </div>
        </div>

        <a
          href="https://www.google.com/maps/search/dermatologist+near+me"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 bg-white/80 dark:bg-white/10 hover:bg-white text-primary border border-primary/30 rounded-2xl text-xs font-semibold shadow-xs hover:shadow-sm transition-all shrink-0 flex items-center gap-1.5"
        >
          <span>Find a dermatologist</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </motion.div>

      {/* G. Image Quality Note (only if fair or poor) */}
      {result.image_quality !== 'good' && (
        <motion.div
          variants={cardVariants}
          className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2.5"
        >
          <Info className="w-4 h-4 text-amber shrink-0" />
          <span>
            <strong>Image Quality Notice ({result.image_quality}):</strong>{' '}
            {result.image_quality_note || 'Sub-optimal lighting or focus may affect pattern accuracy.'}
          </span>
        </motion.div>
      )}

      {/* H. Amber Disclaimer */}
      <motion.div
        variants={cardVariants}
        className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-950 dark:text-amber-100 flex items-start gap-3"
      >
        <AlertTriangle className="w-4 h-4 text-amber shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {result.disclaimer}
        </p>
      </motion.div>

      {/* I. Actions Bar (Desktop inline, Mobile sticky bottom) */}
      <motion.div
        variants={cardVariants}
        className="fixed sm:static bottom-0 left-0 right-0 z-30 bg-white/90 dark:bg-[#150F3C]/95 backdrop-blur-xl sm:bg-transparent p-4 sm:p-0 border-t sm:border-0 border-border shadow-modal sm:shadow-none flex flex-wrap items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleSave}
            disabled={isSavedToHistory || isSaving}
            className={`flex-1 sm:flex-initial px-6 py-3 rounded-2xl text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2 ${
              isSavedToHistory
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 cursor-default'
                : 'bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white cursor-pointer shadow-glowPrimary hover:shadow-glowPrimaryHover hover:-translate-y-0.5'
            }`}
          >
            <BookmarkCheck className="w-4 h-4" />
            <span>{isSavedToHistory ? 'Saved to history' : 'Save to history'}</span>
          </button>

          <button
            onClick={handleDownloadTxt}
            className="px-5 py-3 rounded-2xl text-xs font-semibold bg-white/70 hover:bg-white dark:bg-white/10 dark:hover:bg-white/15 text-text border border-border transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <Download className="w-4 h-4 text-text-muted" />
            <span>Download report</span>
          </button>
        </div>

        <button
          onClick={handleNewScanClick}
          className="w-full sm:w-auto px-5 py-3 rounded-2xl text-xs font-semibold bg-white/70 hover:bg-white dark:bg-white/10 dark:hover:bg-white/15 text-text-body hover:text-text-heading border border-border transition-colors flex items-center justify-center gap-2 shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5 text-text-muted" />
          <span>New scan</span>
        </button>
      </motion.div>

    </motion.div>
  )
}
