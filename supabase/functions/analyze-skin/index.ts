// Supabase Edge Function: analyze-skin
// Runs on Deno runtime in Supabase Edge Functions
// Secured backend that keeps ANTHROPIC_API_KEY private

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

interface AnalyzeRequestBody {
  image: string // Base64 data (without or with data:image/jpeg;base64, prefix)
  bodyLocation?: string
  duration?: string
  symptoms?: string[]
  notes?: string
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    const apiKey = Deno.env.get("ANTHROPIC_API_KEY")
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "CONFIGURATION_ERROR",
          message: "ANTHROPIC_API_KEY is not configured in Supabase Secrets.",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    const body: AnalyzeRequestBody = await req.json()
    const { image, bodyLocation = "Unknown", duration = "Unspecified", symptoms = [], notes = "" } = body

    if (!image) {
      return new Response(
        JSON.stringify({ error: "INVALID_REQUEST", message: "Image base64 is required." }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    // Clean base64 string and extract media type
    let cleanBase64 = image
    let mediaType = "image/jpeg"

    if (image.startsWith("data:")) {
      const match = image.match(/^data:([^;]+);base64,(.+)$/)
      if (match) {
        mediaType = match[1]
        cleanBase64 = match[2]
      }
    }

    const symptomsList = symptoms.length > 0 ? symptoms.join(", ") : "None reported"
    const patientContext = `Body Location: ${bodyLocation}\nDuration: ${duration}\nReported Symptoms: ${symptomsList}\nPatient Notes: ${notes || "None provided"}`

    const systemPrompt = `You are AI Skin Scanner, an expert clinical dermatology decision-support AI for educational skin classification.
First decide whether the image shows human skin with a visible lesion or rash; if not, return {"is_skin_image": false}.
Context: location, duration, symptoms, notes.
You have comprehensive diagnostic knowledge across all major dermatological categories:
1. Eczematous & Dermatitis: Atopic Eczema (L20.9), Contact Dermatitis (L23.9), Seborrheic Dermatitis (L21.9), Dyshidrotic Pompholyx (L30.1), Nummular Eczema (L30.0), Stasis Dermatitis (I87.2).
2. Papulosquamous: Plaque Psoriasis (L40.0), Guttate Psoriasis (L40.4), Pityriasis Rosea (L42), Lichen Planus (L43.9).
3. Acneiform & Rosacea: Acne Vulgaris (L70.0), Cystic Acne, Rosacea (L71.9), Perioral Dermatitis (L71.0), Hidradenitis Suppurativa (L73.2), Folliculitis (L73.9).
4. Fungal Mycoses: Tinea Corporis (B35.4), Tinea Cruris (B35.6), Tinea Pedis (B35.3), Tinea Versicolor (B36.0), Candidal Intertrigo (B37.2).
5. Viral: Herpes Zoster / Shingles (B02.9), Herpes Simplex (B00.9), Molluscum Contagiosum (B08.1), Verruca Vulgaris (B07.9).
6. Bacterial & Infestations: Impetigo (L01.0), Cellulitis (L03.9), Scabies (B86), Arthropod Bites.
7. Urticarial: Acute Urticaria (L50.9), Dermatographia, Erythema Multiforme (L51.9).
8. Pigmentary & Autoimmune: Vitiligo (L80), Melasma (L81.1), Post-inflammatory hyperpigmentation, Alopecia Areata (L63.9).
9. Benign Neoplasms: Seborrheic Keratosis (L82.1), Melanocytic Nevus (D22.9), Cherry Angioma, Epidermoid Cyst, Dermatofibroma, Skin Tags.
10. Pre-Malignant & Malignant Awareness: Actinic Keratosis (L57.0), Basal Cell Carcinoma Suspicion (C44.9), Squamous Cell Carcinoma Suspicion (C44.9), Melanoma Suspicion (C43.9 - flag High Risk and Urgent doctor urgency).

Respond ONLY with valid JSON, no markdown fences, no explanatory text outside JSON.
Required JSON schema:
{
  "is_skin_image": boolean,
  "classification": string,
  "icd_code": string,
  "confidence": number (integer 0-100),
  "risk_level": "low" | "moderate" | "high",
  "risk_summary": string,
  "clinical_description": string,
  "morphology": {
    "primary_lesion": string,
    "color": string,
    "border": string,
    "surface": string,
    "distribution": string
  },
  "common_causes": string[],
  "triggers": string[],
  "recommended_actions": [
    { "action": string, "priority": "immediate" | "soon" | "routine" }
  ],
  "differential_diagnoses": [
    { "name": string, "likelihood": string, "distinguishing": string }
  ],
  "see_doctor_urgency": "routine" | "within_week" | "urgent" | "emergency",
  "see_doctor_reason": string,
  "self_care_tips": string[],
  "avoid": string[],
  "image_quality": "good" | "fair" | "poor",
  "image_quality_note": string,
  "disclaimer": "Simulated analysis — for educational use only. Not a medical diagnosis. Accuracy varies with image quality and may be lower for darker skin tones. Consult a licensed dermatologist."
}

Important clinical copy rules:
- Never claim certainty or use words like 'confirms', 'cures', 'detects', or 'diagnoses'.
- Use 'classifies', 'suggests', 'indicates', 'analyzes'.
- If the image does not show skin or does not exhibit a distinguishable lesion or rash, return {"is_skin_image": false}.`

    // Call Anthropic API with 30s timeout controller
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1200,
          temperature: 0.1,
          system: systemPrompt,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "image",
                  source: {
                    type: "base64",
                    media_type: mediaType,
                    data: cleanBase64,
                  },
                },
                {
                  type: "text",
                  text: `Analyze this skin lesion with context:\n${patientContext}`,
                },
              ],
            },
          ],
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text()
        if (response.status === 429) {
          return new Response(
            JSON.stringify({
              error: "RATE_LIMIT",
              message: "Anthropic Claude API rate limit reached. Please wait before retrying.",
              retryAfterSeconds: 30,
            }),
            {
              status: 429,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          )
        }
        return new Response(
          JSON.stringify({
            error: "NETWORK",
            message: `Anthropic API error (${response.status}): ${errorText}`,
          }),
          {
            status: 502,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        )
      }

      const anthropicData = await response.json()
      const rawText = anthropicData.content?.[0]?.text || ""

      // Strip markdown code fences if present
      const cleanedJsonText = rawText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim()

      let parsedResult
      try {
        parsedResult = JSON.parse(cleanedJsonText)
      } catch (parseErr) {
        return new Response(
          JSON.stringify({
            error: "PARSE_ERROR",
            message: "Unable to parse clinical classification from Claude response.",
            raw: rawText,
          }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        )
      }

      if (parsedResult.is_skin_image === false) {
        return new Response(
          JSON.stringify({
            error: "NOT_SKIN_IMAGE",
            message: "No skin area or distinguishable skin lesion detected in the uploaded image.",
          }),
          {
            status: 422,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        )
      }

      return new Response(JSON.stringify(parsedResult), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    } catch (fetchErr: any) {
      clearTimeout(timeoutId)
      if (fetchErr.name === "AbortError") {
        return new Response(
          JSON.stringify({
            error: "TIMEOUT",
            message: "The analysis request timed out after 30 seconds.",
          }),
          {
            status: 504,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        )
      }
      return new Response(
        JSON.stringify({
          error: "NETWORK",
          message: fetchErr.message || "Failed to connect to Anthropic Vision service.",
        }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        error: "UNKNOWN",
        message: err.message || "An unexpected server error occurred.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    )
  }
})
