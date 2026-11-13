import React, { useState, useRef } from 'react'
import { UploadCloud, CheckCircle2, Image as ImageIcon, AlertCircle, RefreshCw, Trash2, ArrowRight } from 'lucide-react'
import { useScanStore } from '@/store/useScanStore'

export const Step1Upload: React.FC = () => {
  const { formData, handleImageUpload, removeImage, setStep } = useScanStore()
  const [isDragOver, setIsDragOver] = useState(false)
  const [inlineError, setInlineError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const onFileSelected = async (file: File) => {
    setInlineError(null)
    setIsProcessing(true)
    const success = await handleImageUpload(file)
    setIsProcessing(false)
    if (!success) {
      setInlineError('Please select a valid image file (JPG, PNG, WEBP, up to 10MB).')
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelected(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelected(e.target.files[0])
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        aria-label="Upload skin image file"
      />

      {/* Upload Dropzone with Colorful Mesh/Gradient glow */}
      {!formData.imageBase64 ? (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragOver(true)
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && triggerFileInput()}
          className={`relative min-h-[340px] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all duration-300 select-none overflow-hidden group ${
            isDragOver
              ? 'border-primary bg-indigo-500/10 scale-[0.99] shadow-glowPrimary'
              : 'border-indigo-300/60 dark:border-indigo-500/30 hover:border-primary bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 shadow-sm hover:shadow-cardHover'
          }`}
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 bg-radial from-indigo-500/5 via-pink-500/5 to-transparent pointer-events-none group-hover:scale-110 transition-transform duration-500" />

          {/* Floating Upload Icon Circle */}
          <div className="w-18 h-18 w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500/15 via-purple-500/15 to-pink-500/15 text-primary border border-indigo-300/40 dark:border-indigo-500/30 flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 group-hover:shadow-glowPrimary transition-all">
            {isProcessing ? (
              <RefreshCw className="w-8 h-8 animate-spin text-primary" />
            ) : (
              <UploadCloud className="w-8 h-8 text-primary group-hover:text-pink-500 transition-colors" />
            )}
          </div>

          <h4 className="text-base sm:text-lg font-heading font-extrabold text-text mb-1.5">
            {isProcessing ? 'Optimizing photo...' : 'Drag & drop your skin photo here'}
          </h4>
          <p className="text-xs sm:text-sm text-text-muted max-w-sm mb-4">
            or <span className="text-primary dark:text-primary-light font-semibold underline underline-offset-4 decoration-primary/40 hover:decoration-primary">browse from your device</span>
          </p>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2/80 dark:bg-white/10 border border-border text-[11px] font-mono text-text-muted shadow-2xs">
            <span>Supports JPG, PNG, WEBP</span>
            <span>·</span>
            <span>Up to 10MB</span>
          </div>

          {inlineError && (
            <div className="mt-4 flex items-center gap-1.5 text-xs text-risk-high font-medium bg-red-500/10 dark:bg-red-500/20 px-3.5 py-2 rounded-xl border border-red-500/30">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{inlineError}</span>
            </div>
          )}
        </div>
      ) : (
        /* Uploaded State */
        <div className="rounded-3xl p-6 glass-panel border border-white/80 dark:border-white/10 shadow-sm flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-44 h-44 rounded-2xl overflow-hidden bg-surface-2 border border-border shrink-0 shadow-md ring-2 ring-primary/20">
            <img
              src={formData.imagePreviewUrl || formData.imageBase64}
              alt="Uploaded skin lesion"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-gradient-to-r from-teal to-emerald-500 text-white flex items-center gap-1 shadow-glowTeal">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Photo ready
              </span>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-start w-full">
            <div className="flex items-center gap-2 mb-1">
              <ImageIcon className="w-4 h-4 text-primary" />
              <span className="text-xs font-mono font-semibold text-text truncate max-w-[240px]">
                {formData.fileName || 'skin_photo.jpg'}
              </span>
            </div>
            <span className="text-xs text-text-muted font-mono mb-4">
              Size: {formData.fileSize || 'Standard'} · Optimized for clinical inspection
            </span>

            <p className="text-xs text-text-body mb-5 leading-relaxed">
              Image loaded and normalized to 1024px canvas. Ensure the lesion edges and surface texture are sharply visible.
            </p>

            <div className="flex items-center gap-2.5">
              <button
                onClick={triggerFileInput}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-surface-2/80 hover:bg-surface-2 dark:bg-white/10 dark:hover:bg-white/15 text-text border border-border transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5 text-text-muted" />
                Change
              </button>
              <button
                onClick={removeImage}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-risk-high border border-red-500/30 transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5 text-risk-high" />
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-end pt-2">
        <button
          onClick={() => setStep(2)}
          disabled={!formData.imageBase64}
          className={`px-7 py-3 rounded-2xl text-xs font-semibold shadow-sm transition-all flex items-center gap-2 ${
            formData.imageBase64
              ? 'bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white cursor-pointer shadow-glowPrimary hover:shadow-glowPrimaryHover hover:-translate-y-0.5'
              : 'bg-surface-2 dark:bg-white/10 text-text-muted cursor-not-allowed opacity-60'
          }`}
        >
          <span>Continue to Context</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
