import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { ScanHistoryRecord } from '@/types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    !supabaseUrl.includes('your-supabase-url') &&
    !supabaseAnonKey.includes('your-anon-key')
  )
}

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

const LOCAL_STORAGE_HISTORY_KEY = 'aiskinscanner_local_history'

// Local storage fallback helpers
function getLocalHistory(sessionId: string): ScanHistoryRecord[] {
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_HISTORY_KEY}_${sessionId}`) || localStorage.getItem(`dermoscan_local_history_${sessionId}`)
    if (!raw) return []
    return JSON.parse(raw)
  } catch (e) {
    console.error('Failed reading local history', e)
    return []
  }
}

function saveLocalHistory(sessionId: string, records: ScanHistoryRecord[]): void {
  try {
    localStorage.setItem(`${LOCAL_STORAGE_HISTORY_KEY}_${sessionId}`, JSON.stringify(records))
  } catch (e) {
    console.error('Failed saving local history', e)
  }
}

/**
 * Fetch scan history for a given session ID
 */
export async function fetchScanHistory(sessionId: string): Promise<ScanHistoryRecord[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('scan_history')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false })

      if (error) {
        console.warn('Supabase fetch error, falling back to local history:', error.message)
        return getLocalHistory(sessionId)
      }

      if (data && data.length > 0) {
        // Also keep local cache updated
        saveLocalHistory(sessionId, data)
        return data as ScanHistoryRecord[]
      }
    } catch (err) {
      console.warn('Network error reaching Supabase, using local history:', err)
    }
  }

  return getLocalHistory(sessionId)
}

/**
 * Save a new scan record to history
 */
export async function insertScanRecord(record: ScanHistoryRecord): Promise<boolean> {
  let savedToRemote = false

  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase.from('scan_history').insert({
        id: record.id,
        session_id: record.session_id,
        image_thumbnail: record.image_thumbnail,
        body_location: record.body_location,
        duration: record.duration,
        symptoms: record.symptoms,
        notes: record.notes,
        classification: record.classification,
        icd_code: record.icd_code,
        confidence: record.confidence,
        risk_level: record.risk_level,
        see_doctor_urgency: record.see_doctor_urgency,
        full_result: record.full_result,
        created_at: record.created_at,
      })

      if (!error) {
        savedToRemote = true
      } else {
        console.warn('Supabase insert warning:', error.message)
      }
    } catch (err) {
      console.warn('Supabase insert failed, saving to local cache:', err)
    }
  }

  // Always maintain local cache for speed and offline availability
  const existing = getLocalHistory(record.session_id)
  const updated = [record, ...existing.filter((item) => item.id !== record.id)]
  saveLocalHistory(record.session_id, updated)

  return true
}

/**
 * Delete a scan record by ID
 */
export async function deleteScanRecord(id: string, sessionId: string): Promise<boolean> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase
        .from('scan_history')
        .delete()
        .eq('id', id)
        .eq('session_id', sessionId)

      if (error) {
        console.warn('Supabase delete warning:', error.message)
      }
    } catch (err) {
      console.warn('Supabase delete failed:', err)
    }
  }

  const existing = getLocalHistory(sessionId)
  const updated = existing.filter((item) => item.id !== id)
  saveLocalHistory(sessionId, updated)

  return true
}
