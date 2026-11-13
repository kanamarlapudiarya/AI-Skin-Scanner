import React, { useState } from 'react'
import { BODY_REGIONS } from '@/data/regions'
import { useScanStore } from '@/store/useScanStore'
import { DurationOption } from '@/types'
import { MapPin, Clock, Stethoscope, FileEdit, ArrowLeft, ArrowRight, Search } from 'lucide-react'

const DURATION_OPTIONS: DurationOption[] = [
  '<1 week',
  '1-4 weeks',
  '1-3 months',
  '3+ months',
]

const SYMPTOM_OPTIONS = [
  'Itchy',
  'Painful',
  'Burning',
  'Tender',
  'Numb',
  'No sensation',
]

export const Step2Context: React.FC = () => {
  const {
    formData,
    setBodyLocation,
    setDuration,
    toggleSymptom,
    setNotes,
    setStep,
  } = useScanStore()

  const [searchFilter, setSearchFilter] = useState('')

  const filteredRegions = BODY_REGIONS.filter((r) =>
    r.name.toLowerCase().includes(searchFilter.toLowerCase())
  )

  const isNextDisabled = !formData.bodyLocation || !formData.duration

  return (
    <div className="space-y-8">
      {/* Two-Column Balanced Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Column: Anatomical Site & Duration */}
        <div className="space-y-6">
          
          {/* 1. Lesion Anatomical Site */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                1. Lesion Anatomical Site
              </label>
              <span className="text-[11px] text-primary dark:text-primary-light font-semibold">Required</span>
            </div>

            {/* Search Input & Select Dropdown */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 text-text-muted absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search body location..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-white/70 dark:bg-white/5 text-text focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all shadow-xs"
                />
              </div>

              <select
                value={formData.bodyLocation}
                onChange={(e) => setBodyLocation(e.target.value)}
                className="w-full py-2.5 px-3 text-xs rounded-xl border border-border bg-white/70 dark:bg-white/5 text-text font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none shadow-xs transition-all"
                aria-label="Select body site"
              >
                <option value="">-- Choose anatomical location --</option>
                {filteredRegions.map((region) => (
                  <option key={region.id} value={region.name} className="dark:bg-[#1a1444]">
                    {region.name} {region.sensitive ? '(Sensitive)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick-Select Region Chips */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider block">
                Quick Select Region:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {BODY_REGIONS.map((region) => {
                  const isSelected = formData.bodyLocation === region.name
                  return (
                    <button
                      key={region.id}
                      type="button"
                      onClick={() => setBodyLocation(region.name)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-medium border transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white border-primary shadow-xs font-semibold scale-[1.02]'
                          : 'bg-white/60 dark:bg-white/5 text-text-body border-border hover:border-indigo-300/60 dark:hover:border-white/20'
                      }`}
                    >
                      {region.name}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* 2. Duration Segmented Control */}
          <div className="pt-2 border-t border-border/60">
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-primary" />
                2. Lesion Duration
              </label>
              <span className="text-[11px] text-primary dark:text-primary-light font-semibold">Required</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-surface-2/70 dark:bg-white/5 p-1.5 rounded-2xl border border-border">
              {DURATION_OPTIONS.map((dur) => {
                const isSelected = formData.duration === dur
                return (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setDuration(dur)}
                    className={`py-2.5 px-2 text-xs font-semibold rounded-xl transition-all text-center ${
                      isSelected
                        ? 'bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 text-white shadow-glowPrimary'
                        : 'text-text-body hover:text-text-heading hover:bg-white/60 dark:hover:bg-white/10'
                    }`}
                  >
                    {dur}
                  </button>
                )
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Symptoms & Notes */}
        <div className="space-y-6">
          
          {/* Symptom Chips (Multi-select) */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-pink" />
                3. Associated Sensations & Symptoms
              </label>
              <span className="text-[11px] text-text-muted font-normal">Select all that apply</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {SYMPTOM_OPTIONS.map((symptom) => {
                const isChecked = formData.symptoms.includes(symptom)
                return (
                  <button
                    key={symptom}
                    type="button"
                    onClick={() => toggleSymptom(symptom)}
                    className={`px-3.5 py-2 rounded-full text-xs font-medium border transition-all flex items-center gap-2 ${
                      isChecked
                        ? 'bg-gradient-to-r from-indigo-500/15 to-pink-500/15 text-primary dark:text-pink-300 border-indigo-400 dark:border-pink-500 font-semibold shadow-xs ring-1 ring-primary/20 scale-[1.02]'
                        : 'bg-white/60 dark:bg-white/5 text-text-body border-border hover:border-indigo-300/60 dark:hover:border-white/20'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full transition-colors ${
                        isChecked ? 'bg-gradient-to-r from-indigo-500 to-pink-500 animate-pulse' : 'bg-text-muted/40'
                      }`}
                    />
                    {symptom}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Notes Textarea (0/300 counter) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                <FileEdit className="w-3.5 h-3.5 text-teal" />
                4. Additional Clinical Notes
              </label>
              <span
                className={`text-[11px] font-mono font-semibold ${
                  formData.notes.length >= 250 ? 'text-amber' : 'text-text-muted'
                }`}
              >
                {formData.notes.length}/300
              </span>
            </div>

            <textarea
              rows={4}
              maxLength={300}
              value={formData.notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Started as a tiny bump, worsening after outdoor exposure or applying new lotion..."
              className={`w-full p-3.5 text-xs rounded-2xl border bg-white/70 dark:bg-white/5 text-text focus:outline-none transition-all shadow-xs ${
                formData.notes.length >= 250
                  ? 'border-amber focus:border-amber ring-2 ring-amber/20'
                  : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/20'
              }`}
            />
          </div>

        </div>

      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-5 border-t border-border/60">
        <button
          onClick={() => setStep(1)}
          className="px-5 py-2.5 rounded-2xl text-xs font-semibold bg-surface-2/70 hover:bg-surface-2 dark:bg-white/10 dark:hover:bg-white/15 text-text transition-colors flex items-center gap-2 border border-border"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Photo</span>
        </button>

        <button
          onClick={() => setStep(3)}
          disabled={isNextDisabled}
          className={`px-7 py-3 rounded-2xl text-xs font-semibold shadow-sm transition-all flex items-center gap-2 ${
            !isNextDisabled
              ? 'bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white cursor-pointer shadow-glowPrimary hover:shadow-glowPrimaryHover hover:-translate-y-0.5'
              : 'bg-surface-2 dark:bg-white/10 text-text-muted cursor-not-allowed opacity-60'
          }`}
        >
          <span>Review & Confirm</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
