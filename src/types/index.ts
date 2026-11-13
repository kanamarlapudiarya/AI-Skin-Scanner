export type ScanStatus = 'idle' | 'analyzing' | 'results' | 'error'

export type RiskLevel = 'low' | 'moderate' | 'high'

export type DoctorUrgency = 'routine' | 'within_week' | 'urgent' | 'emergency'

export type ActionPriority = 'immediate' | 'soon' | 'routine'

export type ImageQuality = 'good' | 'fair' | 'poor'

export type DurationOption = '<1 week' | '1-4 weeks' | '1-3 months' | '3+ months'

export interface Morphology {
  primary_lesion: string
  color: string
  border: string
  surface: string
  distribution: string
}

export interface RecommendedAction {
  action: string
  priority: ActionPriority
}

export interface DifferentialDiagnosis {
  name: string
  likelihood: string // e.g. "Moderate", "Possible", "Low"
  distinguishing: string
  conditionId?: string
}

export interface AnalysisResult {
  is_skin_image: boolean
  classification: string
  icd_code: string
  confidence: number // 0-100
  risk_level: RiskLevel
  risk_summary: string
  clinical_description: string
  morphology: Morphology
  common_causes: string[]
  triggers: string[]
  recommended_actions: RecommendedAction[]
  differential_diagnoses: DifferentialDiagnosis[]
  see_doctor_urgency: DoctorUrgency
  see_doctor_reason: string
  self_care_tips: string[]
  avoid: string[]
  image_quality: ImageQuality
  image_quality_note?: string
  disclaimer: string
  analyzed_at?: string
  // Optional thumbnail preview retained for session
  imageThumbnailUrl?: string
}

export interface ScanFormData {
  imageFile: File | null
  imageBase64: string | null
  imagePreviewUrl: string | null
  fileName: string | null
  fileSize: string | null
  bodyLocation: string
  duration: DurationOption | ''
  symptoms: string[]
  notes: string
  consentGiven: boolean
}

export interface ScanHistoryRecord {
  id: string
  session_id: string
  image_thumbnail: string
  body_location: string
  duration: string
  symptoms: string[]
  notes: string
  classification: string
  icd_code: string
  confidence: number
  risk_level: RiskLevel
  see_doctor_urgency: DoctorUrgency
  full_result: AnalysisResult
  created_at: string
}

export type AnalysisErrorType = 
  | 'NOT_SKIN_IMAGE'
  | 'RATE_LIMIT'
  | 'TIMEOUT'
  | 'PARSE_ERROR'
  | 'NETWORK'
  | 'FILE_TOO_LARGE'
  | 'INVALID_FORMAT'
  | 'UNKNOWN'

export interface AnalysisError {
  type: AnalysisErrorType
  title: string
  message: string
  retryAfterSeconds?: number
}

export interface HistoryFilters {
  risk: 'all' | 'low' | 'moderate' | 'high'
  bodyRegion: string
  sort: 'newest' | 'oldest' | 'highest_risk'
}

export interface ToastNotification {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}
