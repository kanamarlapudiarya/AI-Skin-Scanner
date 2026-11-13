import { create } from 'zustand'
import {
  ScanStatus,
  ScanFormData,
  AnalysisResult,
  ScanHistoryRecord,
  AnalysisError,
  HistoryFilters,
  ToastNotification,
  DurationOption,
} from '@/types'
import {
  fetchScanHistory,
  insertScanRecord,
  deleteScanRecord,
} from '@/lib/supabaseClient'
import { analyzeSkin } from '@/services/analysisService'
import { processImageForAnalysis, validateImageFile } from '@/lib/imageUtils'

const SESSION_STORAGE_KEY = 'aiskinscanner_session_id'

function getOrCreateSessionId(): string {
  try {
    const existing = localStorage.getItem(SESSION_STORAGE_KEY) || localStorage.getItem('dermoscan_session_id')
    if (existing && existing.length >= 8) {
      return existing
    }
    const newId = crypto.randomUUID ? crypto.randomUUID() : 'sess-' + Math.random().toString(36).substring(2, 15)
    localStorage.setItem(SESSION_STORAGE_KEY, newId)
    return newId
  } catch {
    return 'sess-' + Math.random().toString(36).substring(2, 10)
  }
}

const initialFormData: ScanFormData = {
  imageFile: null,
  imageBase64: null,
  imagePreviewUrl: null,
  fileName: null,
  fileSize: null,
  bodyLocation: '',
  duration: '',
  symptoms: [],
  notes: '',
  consentGiven: false,
}

interface ScanStoreState {
  sessionId: string
  step: 1 | 2 | 3
  status: ScanStatus
  formData: ScanFormData
  result: AnalysisResult | null
  error: AnalysisError | null
  isSavedToHistory: boolean
  
  // History & Filters
  history: ScanHistoryRecord[]
  isHistoryLoading: boolean
  activeHistoryItem: ScanHistoryRecord | null
  drawerOpen: boolean
  highlightedScanId: string | null
  filters: HistoryFilters

  // Sample modal & UI
  sampleModalOpen: boolean
  selectedConditionId: string | null
  toasts: ToastNotification[]
  activeSection: string
  abortController: AbortController | null
  theme: 'light' | 'dark'

  // Actions
  setSelectedConditionId: (id: string | null) => void
  toggleTheme: () => void
  setTheme: (theme: 'light' | 'dark') => void
  setStep: (step: 1 | 2 | 3) => void
  setStatus: (status: ScanStatus) => void
  setFormData: (partial: Partial<ScanFormData>) => void
  handleImageUpload: (file: File) => Promise<boolean>
  removeImage: () => void
  toggleSymptom: (symptom: string) => void
  setDuration: (duration: DurationOption) => void
  setBodyLocation: (location: string) => void
  setNotes: (notes: string) => void
  setConsent: (consent: boolean) => void
  
  // Flow actions
  startAnalysis: () => Promise<void>
  cancelAnalysis: () => void
  resetToNewScan: () => void
  loadRecordIntoReport: (record: ScanHistoryRecord) => void
  saveCurrentResultToHistory: () => Promise<void>
  deleteHistoryItem: (id: string) => Promise<void>
  refreshHistory: () => Promise<void>

  // Filters
  setRiskFilter: (risk: HistoryFilters['risk']) => void
  setBodyRegionFilter: (region: string) => void
  setSortFilter: (sort: HistoryFilters['sort']) => void
  resetFilters: () => void

  // Modals & UI
  setSampleModalOpen: (open: boolean) => void
  setActiveHistoryItem: (item: ScanHistoryRecord | null) => void
  setDrawerOpen: (open: boolean) => void
  setActiveSection: (section: string) => void
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void
  removeToast: (id: string) => void
  copySessionId: () => void
}

function scrollToAnchor(id: string) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

export const useScanStore = create<ScanStoreState>((set, get) => ({
  sessionId: getOrCreateSessionId(),
  step: 1,
  status: 'idle',
  formData: { ...initialFormData },
  result: null,
  error: null,
  isSavedToHistory: false,

  history: [],
  isHistoryLoading: false,
  activeHistoryItem: null,
  drawerOpen: false,
  highlightedScanId: null,
  filters: {
    risk: 'all',
    bodyRegion: 'all',
    sort: 'newest',
  },

  sampleModalOpen: false,
  selectedConditionId: null,
  toasts: [],
  activeSection: 'home',
  abortController: null,
  theme: (typeof window !== 'undefined' && localStorage.getItem('aiskinscanner_theme') === 'dark') ? 'dark' : 'light',

  setSelectedConditionId: (selectedConditionId) => set({ selectedConditionId }),

  toggleTheme: () => {
    const nextTheme = get().theme === 'dark' ? 'light' : 'dark'
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('aiskinscanner_theme', nextTheme)
    set({ theme: nextTheme })
  },

  setTheme: (theme) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('aiskinscanner_theme', theme)
    set({ theme })
  },

  setStep: (step) => set({ step }),

  setStatus: (status) => {
    set({ status })
    // On status change, smooth-scroll to the top of #scan
    scrollToAnchor('scan')
  },

  setFormData: (partial) => {
    set((state) => ({
      formData: { ...state.formData, ...partial },
    }))
  },

  handleImageUpload: async (file: File) => {
    const validation = validateImageFile(file)
    if (!validation.valid) {
      get().addToast(validation.error || 'Invalid file', 'error')
      return false
    }

    try {
      const processed = await processImageForAnalysis(file)
      set((state) => ({
        formData: {
          ...state.formData,
          imageFile: file,
          imageBase64: processed.base64,
          imagePreviewUrl: processed.previewUrl,
          fileName: file.name,
          fileSize: processed.fileSizeFormatted,
        },
      }))
      get().addToast('Photo ready for scan', 'info')
      return true
    } catch (err: any) {
      get().addToast(err.message || 'Error processing image', 'error')
      return false
    }
  },

  removeImage: () => {
    set((state) => ({
      formData: {
        ...state.formData,
        imageFile: null,
        imageBase64: null,
        imagePreviewUrl: null,
        fileName: null,
        fileSize: null,
      },
    }))
  },

  toggleSymptom: (symptom: string) => {
    set((state) => {
      const current = state.formData.symptoms
      if (symptom === 'No sensation') {
        return {
          formData: {
            ...state.formData,
            symptoms: current.includes('No sensation') ? [] : ['No sensation'],
          },
        }
      }
      const filtered = current.filter((s) => s !== 'No sensation')
      const exists = filtered.includes(symptom)
      const next = exists ? filtered.filter((s) => s !== symptom) : [...filtered, symptom]
      return {
        formData: {
          ...state.formData,
          symptoms: next,
        },
      }
    })
  },

  setDuration: (duration: DurationOption) => {
    set((state) => ({
      formData: { ...state.formData, duration },
    }))
  },

  setBodyLocation: (location: string) => {
    set((state) => ({
      formData: { ...state.formData, bodyLocation: location },
    }))
  },

  setNotes: (notes: string) => {
    set((state) => ({
      formData: { ...state.formData, notes: notes.slice(0, 300) },
    }))
  },

  setConsent: (consentGiven: boolean) => {
    set((state) => ({
      formData: { ...state.formData, consentGiven },
    }))
  },

  startAnalysis: async () => {
    const { formData } = get()
    if (!formData.imageBase64) {
      get().addToast('Please upload a photo first', 'error')
      return
    }

    const controller = new AbortController()
    set({
      status: 'analyzing',
      error: null,
      abortController: controller,
      isSavedToHistory: false,
    })
    scrollToAnchor('scan')

    try {
      const result = await analyzeSkin(formData, controller.signal)
      set({
        result,
        status: 'results',
        abortController: null,
      })
      scrollToAnchor('scan')
    } catch (err: any) {
      if (err.name === 'AbortError' || err.type === 'TIMEOUT') {
        set({
          status: 'idle',
          abortController: null,
        })
        get().addToast('Analysis cancelled', 'info')
        return
      }

      set({
        status: 'error',
        error: {
          type: err.type || 'UNKNOWN',
          title: err.title || 'Analysis Error',
          message: err.message || 'An unexpected error occurred during classification.',
          retryAfterSeconds: err.retryAfterSeconds,
        },
        abortController: null,
      })
      scrollToAnchor('scan')
    }
  },

  cancelAnalysis: () => {
    const { abortController } = get()
    if (abortController) {
      abortController.abort()
    }
    set({
      status: 'idle',
      abortController: null,
    })
    scrollToAnchor('scan')
  },

  resetToNewScan: () => {
    set({
      step: 1,
      status: 'idle',
      formData: { ...initialFormData },
      result: null,
      error: null,
      isSavedToHistory: false,
    })
    scrollToAnchor('scan')
  },

  loadRecordIntoReport: (record: ScanHistoryRecord) => {
    set({
      result: {
        ...record.full_result,
        imageThumbnailUrl: record.image_thumbnail,
      },
      status: 'results',
      drawerOpen: false,
      isSavedToHistory: true,
    })
    scrollToAnchor('scan')
  },

  saveCurrentResultToHistory: async () => {
    const { result, formData, sessionId, history } = get()
    if (!result) return

    const recordId = crypto.randomUUID ? crypto.randomUUID() : 'rec-' + Date.now()
    const newRecord: ScanHistoryRecord = {
      id: recordId,
      session_id: sessionId,
      image_thumbnail: formData.imageBase64 || result.imageThumbnailUrl || '',
      body_location: formData.bodyLocation || 'General skin area',
      duration: formData.duration || 'Unspecified',
      symptoms: formData.symptoms,
      notes: formData.notes,
      classification: result.classification,
      icd_code: result.icd_code,
      confidence: result.confidence,
      risk_level: result.risk_level,
      see_doctor_urgency: result.see_doctor_urgency,
      full_result: result,
      created_at: new Date().toISOString(),
    }

    try {
      await insertScanRecord(newRecord)
      set({
        history: [newRecord, ...history.filter((h) => h.id !== recordId)],
        isSavedToHistory: true,
        highlightedScanId: recordId,
      })
      get().addToast('Saved to history', 'success')
      scrollToAnchor('history')

      // Clear highlight after 3.5 seconds
      setTimeout(() => {
        set({ highlightedScanId: null })
      }, 3500)
    } catch (err) {
      get().addToast('Failed to save to history', 'error')
    }
  },

  deleteHistoryItem: async (id: string) => {
    const { sessionId, history, activeHistoryItem } = get()
    try {
      await deleteScanRecord(id, sessionId)
      const nextHistory = history.filter((item) => item.id !== id)
      set({
        history: nextHistory,
        drawerOpen: activeHistoryItem?.id === id ? false : get().drawerOpen,
        activeHistoryItem: activeHistoryItem?.id === id ? null : activeHistoryItem,
      })
      get().addToast('Deleted scan', 'info')
    } catch {
      get().addToast('Failed to delete scan', 'error')
    }
  },

  refreshHistory: async () => {
    const { sessionId } = get()
    set({ isHistoryLoading: true })
    try {
      const records = await fetchScanHistory(sessionId)
      set({ history: records, isHistoryLoading: false })
    } catch (e) {
      set({ isHistoryLoading: false })
    }
  },

  setRiskFilter: (risk) => {
    set((state) => ({
      filters: { ...state.filters, risk },
    }))
  },

  setBodyRegionFilter: (bodyRegion) => {
    set((state) => ({
      filters: { ...state.filters, bodyRegion },
    }))
  },

  setSortFilter: (sort) => {
    set((state) => ({
      filters: { ...state.filters, sort },
    }))
  },

  resetFilters: () => {
    set({
      filters: {
        risk: 'all',
        bodyRegion: 'all',
        sort: 'newest',
      },
    })
  },

  setSampleModalOpen: (sampleModalOpen) => set({ sampleModalOpen }),

  setActiveHistoryItem: (activeHistoryItem) => set({ activeHistoryItem }),

  setDrawerOpen: (drawerOpen) => set({ drawerOpen }),

  setActiveSection: (activeSection) => set({ activeSection }),

  addToast: (message, type = 'info') => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9)
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }))
    setTimeout(() => {
      get().removeToast(id)
    }, 3800)
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }))
  },

  copySessionId: () => {
    const { sessionId } = get()
    navigator.clipboard.writeText(sessionId)
    get().addToast('Session ID copied', 'info')
  },
}))
