import React from 'react'
import { useScanStore } from '@/store/useScanStore'
import { Sparkles, AlertTriangle, ArrowLeft, Edit2 } from 'lucide-react'

export const Step3Review: React.FC = () => {
  const { formData, setStep, setConsent, startAnalysis } = useScanStore()

  return (
    <div className="space-y-6">
      {/* Summary Card with Glassmorphism */}
      <div className="glass-panel rounded-3xl border border-white/80 dark:border-white/10 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-5 border-b border-border/60">
          <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-surface-2 border border-border shrink-0 shadow-md ring-2 ring-primary/20">
            <img
              src={formData.imagePreviewUrl || formData.imageBase64 || ''}
              alt="Skin lesion thumbnail"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted">
                Pre-Analysis Review
              </span>
              <button
                onClick={() => setStep(1)}
                className="text-xs font-semibold text-primary dark:text-primary-light hover:underline flex items-center gap-1"
              >
                <Edit2 className="w-3 h-3" />
                Change Photo
              </button>
            </div>
            <h4 className="text-base font-heading font-extrabold text-text">
              {formData.fileName || 'Selected Skin Image'}
            </h4>
            <p className="text-xs text-text-muted">
              Pre-processed to 1024px JPEG · Ready for pattern classification
            </p>
          </div>
        </div>

        {/* Structured Metadata Rows */}
        <div className="divide-y divide-border/50 text-xs">
          {/* Location */}
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-text-muted w-24">Location:</span>
              <span className="font-semibold text-text font-mono">
                {formData.bodyLocation || 'Not specified'}
              </span>
            </div>
            <button
              onClick={() => setStep(2)}
              className="text-primary dark:text-primary-light hover:underline font-semibold text-[11px]"
            >
              Edit
            </button>
          </div>

          {/* Duration */}
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-text-muted w-24">Duration:</span>
              <span className="font-semibold text-text font-mono">
                {formData.duration || 'Not specified'}
              </span>
            </div>
            <button
              onClick={() => setStep(2)}
              className="text-primary dark:text-primary-light hover:underline font-semibold text-[11px]"
            >
              Edit
            </button>
          </div>

          {/* Symptoms */}
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-start gap-2">
              <span className="text-text-muted w-24 shrink-0">Symptoms:</span>
              <div className="flex flex-wrap gap-1.5">
                {formData.symptoms.length > 0 ? (
                  formData.symptoms.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-0.5 rounded-full bg-white/70 dark:bg-white/10 text-text font-medium text-[11px] border border-border shadow-2xs"
                    >
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-text-muted italic">None reported</span>
                )}
              </div>
            </div>
            <button
              onClick={() => setStep(2)}
              className="text-primary dark:text-primary-light hover:underline font-semibold text-[11px] shrink-0 ml-2"
            >
              Edit
            </button>
          </div>

          {/* Notes */}
          <div className="py-3 flex items-start justify-between">
            <div className="flex items-start gap-2 max-w-[85%]">
              <span className="text-text-muted w-24 shrink-0">Notes:</span>
              <span className="text-text-body font-normal italic">
                {formData.notes || 'No extra notes provided.'}
              </span>
            </div>
            <button
              onClick={() => setStep(2)}
              className="text-primary dark:text-primary-light hover:underline font-semibold text-[11px] shrink-0"
            >
              Edit
            </button>
          </div>
        </div>
      </div>

      {/* Amber SIMULATED ANALYSIS Callout */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
        <AlertTriangle className="w-4 h-4 text-amber shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold font-mono tracking-wide uppercase text-[11px] text-amber-950 dark:text-amber-100">
            SIMULATED ANALYSIS & EDUCATIONAL NOTICE
          </div>
          <p className="leading-relaxed">
            AI Skin Scanner is an educational decision-support research interface. It provides visual pattern classification suggestions based on clinical computer vision. It is <strong>not</strong> a medical device and does <strong>not</strong> provide diagnostic certainty.
          </p>
        </div>
      </div>

      {/* Required Consent Checkbox */}
      <div className="p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-border/80">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={formData.consentGiven}
            onChange={(e) => setConsent(e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded-md text-primary focus:ring-primary border-border cursor-pointer"
          />
          <span className="text-xs text-text-body leading-relaxed font-medium">
            I understand this is an educational tool and I'll consult a dermatologist for medical concerns.
          </span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-border/60">
        <button
          onClick={() => setStep(2)}
          className="px-5 py-2.5 rounded-2xl text-xs font-semibold bg-surface-2/70 hover:bg-surface-2 dark:bg-white/10 dark:hover:bg-white/15 text-text transition-colors flex items-center gap-2 border border-border"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Context</span>
        </button>

        <button
          onClick={startAnalysis}
          disabled={!formData.consentGiven}
          className={`px-7 py-3 rounded-2xl text-xs font-semibold shadow-sm transition-all flex items-center gap-2.5 ${
            formData.consentGiven
              ? 'bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white cursor-pointer shadow-glowPrimary hover:shadow-glowPrimaryHover hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98]'
              : 'bg-surface-2 dark:bg-white/10 text-text-muted cursor-not-allowed opacity-60'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Analyze my skin</span>
        </button>
      </div>
    </div>
  )
}
