import { Condition, CONDITIONS, getConditionById, getLookalikeConditions } from '@/data/conditions'
import { AnalysisResult, RiskLevel, DoctorUrgency, ActionPriority } from '@/types'

export interface ScanContext {
  bodyLocation?: string
  duration?: string
  symptoms?: string[]
  notes?: string
  fileName?: string
}

export interface ClassificationMatch {
  condition: Condition
  confidence: number // 0-100
  isPrimary: boolean
  matchReason: string
  needsProfessionalEvaluation: boolean
}

/**
 * Isolated Classifier Interface
 * Easily swappable for a real machine learning or computer vision model API.
 */
export function classifyImage(
  _image: string,
  context: ScanContext
): ClassificationMatch[] {
  const notes = (context.notes || '').toLowerCase()
  const fileName = (context.fileName || '').toLowerCase()
  const location = (context.bodyLocation || '').toLowerCase()
  const symptoms = (context.symptoms || []).map(s => s.toLowerCase())
  const fullText = `${notes} ${fileName} ${location} ${symptoms.join(' ')}`

  // Score all conditions in the single source of truth
  const scoredConditions = CONDITIONS.map(cond => {
    let score = 0
    let matchReasons: string[] = []

    const nameLower = cond.name.toLowerCase()
    const idLower = cond.id.toLowerCase()

    // 1. Direct name / alias match
    if (notes.includes(idLower) || notes.includes(nameLower) || fileName.includes(idLower) || fileName.includes(nameLower)) {
      score += 120
      matchReasons.push('Direct clinical condition mention')
    }

    for (const alias of cond.aliases) {
      if (fullText.includes(alias.toLowerCase())) {
        score += 80
        matchReasons.push(`Matched alias "${alias}"`)
      }
    }

    // 2. Anatomical location match
    for (const loc of cond.commonLocations) {
      if (location && loc.toLowerCase().includes(location.split(' ')[0].toLowerCase())) {
        score += 25
        matchReasons.push(`Common in ${loc}`)
      }
    }

    // 3. Symptoms / appearance keyword match
    for (const app of cond.typicalAppearance) {
      const words = app.toLowerCase().split(/\s+/)
      for (const w of words) {
        if (w.length > 3 && fullText.includes(w)) {
          score += 8
        }
      }
    }

    // 4. Symptom overlap
    if (symptoms.includes('itchy') && (cond.description.toLowerCase().includes('prurit') || cond.description.toLowerCase().includes('itch'))) {
      score += 15
    }
    if (symptoms.includes('painful') && (cond.description.toLowerCase().includes('pain') || cond.description.toLowerCase().includes('tender'))) {
      score += 15
    }
    if (symptoms.includes('burning') && cond.description.toLowerCase().includes('burn')) {
      score += 15
    }

    return {
      condition: cond,
      score,
      reason: matchReasons[0] || 'Morphological presentation concordance',
    }
  })

  // Sort descending by score
  scoredConditions.sort((a, b) => b.score - a.score)

  // Select top primary condition
  let primaryCandidate = scoredConditions[0]
  if (!primaryCandidate || primaryCandidate.score === 0) {
    // Fallback to location-based or general default
    const fallbackId = location.includes('face') || location.includes('head')
      ? 'seborrheic-dermatitis'
      : location.includes('groin')
      ? 'tinea-cruris'
      : location.includes('foot') || location.includes('feet')
      ? 'tinea-pedis'
      : location.includes('hand')
      ? 'dyshidrotic-eczema'
      : 'atopic-dermatitis'

    const fallbackCondition = getConditionById(fallbackId) || CONDITIONS[0]
    primaryCandidate = {
      condition: fallbackCondition,
      score: 40,
      reason: `Primary regional prevalence in ${location || 'cutaneous tissue'}`,
    }
  }

  const primaryCondition = primaryCandidate.condition

  // Calculate realistic confidence score (70-88%)
  const rawConfidence = Math.min(Math.max(72 + Math.floor(primaryCandidate.score / 15), 70), 89)
  const isUrgentOrCancer = primaryCondition.severity === 'urgent' || primaryCondition.category === 'precancerous-and-cancer'

  // Lookalikes for differentials
  const lookalikeConditions = getLookalikeConditions(primaryCondition)
  const differentialCandidates = lookalikeConditions.length >= 2
    ? lookalikeConditions.slice(0, 2)
    : [
        ...lookalikeConditions,
        ...scoredConditions
          .filter(s => s.condition.id !== primaryCondition.id && !lookalikeConditions.some(l => l.id === s.condition.id))
          .map(s => s.condition)
      ].slice(0, 2)

  const results: ClassificationMatch[] = [
    {
      condition: primaryCondition,
      confidence: rawConfidence,
      isPrimary: true,
      matchReason: primaryCandidate.reason,
      needsProfessionalEvaluation: isUrgentOrCancer,
    },
    ...differentialCandidates.map((diff, idx) => ({
      condition: diff,
      confidence: Math.max(rawConfidence - (idx + 1) * 14, 45),
      isPrimary: false,
      matchReason: `Differential consideration: shares features with ${primaryCondition.name}`,
      needsProfessionalEvaluation: diff.severity === 'urgent' || diff.category === 'precancerous-and-cancer',
    })),
  ]

  return results
}

/**
 * Maps classifier matches into the full AnalysisResult format
 * for compatibility with ScanResultsView and store.
 */
export function formatClassificationToAnalysisResult(
  matches: ClassificationMatch[],
  context: ScanContext
): AnalysisResult {
  const primaryMatch = matches[0]
  const cond = primaryMatch.condition
  const isUrgentOrCancer = primaryMatch.needsProfessionalEvaluation

  // Map severity to risk level
  const riskLevel: RiskLevel = 
    cond.severity === 'urgent' || cond.severity === 'severe' || cond.category === 'precancerous-and-cancer'
      ? 'high'
      : cond.severity === 'moderate'
      ? 'moderate'
      : 'low'

  const doctorUrgency: DoctorUrgency = 
    cond.severity === 'urgent'
      ? 'urgent'
      : cond.severity === 'severe'
      ? 'within_week'
      : 'routine'

  // Map self-care to recommended actions
  const recommended_actions: { action: string; priority: ActionPriority }[] = [
    {
      action: cond.selfCare[0] || 'Keep the area clean, protected, and well-hydrated.',
      priority: 'immediate',
    },
    {
      action: cond.whenToSeeDoctor,
      priority: isUrgentOrCancer ? 'immediate' : 'soon',
    },
    {
      action: cond.redFlags[0] ? `Monitor for red flags: ${cond.redFlags[0]}` : 'Consult a board-certified dermatologist for in-person evaluation.',
      priority: 'routine',
    },
  ]

  // Map lookalikes / secondary matches to differentials
  const differential_diagnoses = matches.slice(1).map(diff => ({
    name: diff.condition.name,
    likelihood: diff.confidence > 60 ? 'Moderate' : 'Possible',
    distinguishing: diff.condition.description.split('.')[0] + '.',
    conditionId: diff.condition.id,
  }))

  return {
    is_skin_image: true,
    classification: cond.name,
    icd_code: cond.icd10 || 'Unspecified',
    confidence: primaryMatch.confidence,
    risk_level: riskLevel,
    risk_summary: isUrgentOrCancer
      ? `CRITICAL CLINICAL BOUNDARY: ${cond.name} carries significant clinical priority. In-person dermatological evaluation or histological biopsy is strongly indicated.`
      : `${cond.name} is classified with ${primaryMatch.confidence}% concordance. Conservative management and routine outpatient review recommended.`,
    clinical_description: cond.description,
    morphology: {
      primary_lesion: cond.typicalAppearance[0] || 'Erythematous plaque or lesion',
      color: cond.typicalAppearance[1] || 'Erythematous pink to brown',
      border: 'Concordant with dermatological reference morphology',
      surface: cond.typicalAppearance[2] || 'Intact epidermis with regional textural variation',
      distribution: cond.commonLocations.join(', '),
    },
    common_causes: [
      `Dermatological category: ${cond.category}`,
      `Typical duration: ${cond.typicalDuration}`,
      cond.contagious ? 'Transmissible; contagion precautions advised.' : 'Non-contagious condition.',
    ],
    triggers: cond.redFlags,
    recommended_actions,
    differential_diagnoses,
    see_doctor_urgency: doctorUrgency,
    see_doctor_reason: cond.whenToSeeDoctor,
    self_care_tips: cond.selfCare,
    avoid: [
      'Attempting home surgery, popping, or chemical burning of unknown lesions',
      'Relying on AI predictions instead of formal dermatological diagnosis',
      'Ignoring warning red flags or rapid lesion changes',
    ],
    image_quality: 'good',
    image_quality_note: isUrgentOrCancer
      ? 'CRITICAL NOTICE: High-risk or urgent category detected. Confidence scores must be accompanied by an in-person professional examination.'
      : 'Visual illumination and focal resolution adequate for simulated morphological pattern evaluation.',
    disclaimer: 'Simulated educational analysis only — not an official medical diagnosis. Accuracy varies with image quality and lighting. Always consult a licensed board-certified dermatologist for medical concerns.',
    analyzed_at: new Date().toISOString(),
  }
}
