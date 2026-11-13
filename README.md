# AI Skin Scanner: Localized Skin Lesion and Rash Classification System

> A calm, precise clinical SaaS single-page web application for educational skin lesion and rash classification using Claude Vision and Supabase.

---

## 1. Architectural Highlights

- **Single-Page Scrolling Layout**: Everything lives on one contiguous page with smooth anchor navigation (`#home`, `#scan`, `#history`, `#learn`, `Footer`). No client-side routers or page unloads.
- **Scroll-Spy & Sticky Glass Header**: 64px frosted glass navbar (`backdrop-blur-md`) with real-time active section tracking and mobile slide-in drawer.
- **In-Place Dynamic Studio**: The Scan Studio dynamically transitions in-place:
  - `idle` → 3-step structured wizard (Upload → Anatomical context & symptoms → Review & consent)
  - `analyzing` → Concentric 3-ring Sonar Scan pulsing animation with cycling clinical status text
  - `results` → Full structured report (Hero, Morphology, Differentials, Timeline, Self-care, Doctor Urgency)
  - `error` → Specific clinical error recovery (Not a skin image tips, 30s rate-limit countdown, network guidance)
- **Signature Sonar Pulse**: Three concentric expanding rings pulse outward from the uploaded lesion photo (`scale 1 → 2`, `opacity 0.5 → 0`, `2.4s infinite`, delays `0 / 600 / 1200ms`, `rgba(10,95,180,0.18)`).
- **Secure Anthropic Vision Pipeline**: Private Supabase Edge Function (`analyze-skin`) calls `claude-sonnet-4-6`. The Anthropic API key is strictly stored in Supabase secrets and **never** exposed to the browser.
- **Client-Side Pre-processing**: Client canvas resizes photos to max 1024px, encodes to JPEG 0.85, and creates 200px thumbnails for history storage. Rejects payloads > 5MB.
- **Session-Based RLS**: Anonymous session UUID generated on first visit, stored in `localStorage`, and enforced in Supabase database Row Level Security (`scan_history`).

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 18 + TypeScript |
| **Bundler & Build** | Vite 5 |
| **Styling** | Tailwind CSS v3 (Custom Clinical Theme) |
| **Animations** | Framer Motion (Subtle fade-up, step slide, Sonar rings) |
| **State Management** | Zustand (Session, Step, FormData, Status, Result, History, Filters) |
| **Icons** | Lucide React |
| **Backend & DB** | Supabase (PostgreSQL with RLS + Deno Edge Functions) |
| **AI Model** | Claude Vision API (`claude-sonnet-4-6`) |

---

## 3. Design System Tokens

```css
/* Core Color Palette */
--bg:          #EEF2F7;
--surface:     #FFFFFF;
--surface-2:   #F5F8FB;
--border:      #DDE3EC;
--primary:     #0A5FB4;
--primary-dim: #E8F1FB;
--teal:        #0D9488;
--risk-low:    #059669;
--risk-mid:    #D97706;
--risk-high:   #DC2626;
--amber:       #F59E0B;
--text:        #0D1829;
--text-2:      #3D4F63;
--muted:       #64748B;
```

- **Typography**:
  - Headings: `Plus Jakarta Sans` (700, 800)
  - Body: `Inter` (400, 500, 600)
  - Clinical data & classification badges: `JetBrains Mono` (400, 500, 600)
- **Radii**:
  - Cards: `14px` (`rounded-card`)
  - Buttons: `10px` (`rounded-btn`)
  - Pills: `999px` (`rounded-full`)
- **Shadows**:
  - Subtle: `0 1px 4px rgba(0,0,0,0.06)`
  - Card: `0 4px 20px rgba(0,0,0,0.05)`

---

## 4. Supabase Setup & SQL Migration

### 4.1 Apply the Database Schema
Execute the following SQL migration in your Supabase SQL Editor (`supabase/migrations/001_create_scan_history.sql`):

```sql
create extension if not exists "uuid-ossp";

create table if not exists public.scan_history (
  id uuid primary key default uuid_generate_v4(),
  session_id text not null,
  image_thumbnail text not null, -- 200px base64 JPEG
  body_location text not null,
  duration text not null,
  symptoms text[] not null default '{}',
  notes text default '',
  classification text not null,
  icd_code text not null,
  confidence integer not null check (confidence >= 0 and confidence <= 100),
  risk_level text not null check (risk_level in ('low', 'moderate', 'high')),
  see_doctor_urgency text not null check (see_doctor_urgency in ('routine', 'within_week', 'urgent', 'emergency')),
  full_result jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_scan_history_session_id on public.scan_history (session_id);
create index if not exists idx_scan_history_created_at on public.scan_history (created_at desc);

alter table public.scan_history enable row level security;

create policy "Allow access by session id"
  on public.scan_history
  for all
  using (
    session_id = coalesce(
      current_setting('request.headers', true)::json->>'x-session-id',
      session_id
    )
  )
  with check (
    session_id = coalesce(
      current_setting('request.headers', true)::json->>'x-session-id',
      session_id
    )
  );
```

### 4.2 Deploy the Supabase Edge Function
The edge function resides in `supabase/functions/analyze-skin/index.ts`. Deploy using the Supabase CLI:

```bash
# 1. Login to Supabase CLI
supabase login

# 2. Link your project
supabase link --project-ref your-project-id

# 3. Configure Anthropic API Secret
supabase secrets set ANTHROPIC_API_KEY=sk-ant-api03-...

# 4. Deploy the Edge Function
supabase functions deploy analyze-skin --no-verify-jwt
```

---

## 5. Local Development Setup

### 5.1 Prerequisites
- Node.js 18+ or 20+ LTS
- npm 9+

### 5.2 Installation
```bash
# Clone the repository and enter directory
cd "Dermo Scan"

# Install dependencies
npm install
```

### 5.3 Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Set your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
*(Note: If Supabase variables are left blank during initial local testing, AI Skin Scanner automatically switches to a high-fidelity local clinical simulation mode, allowing full UI, navigation, and drawer review immediately out of the box).*

### 5.4 Run Development Server
```bash
npm run dev
```

### 5.5 Production Build
```bash
npm run build
npm run preview
```

---

## 6. Clinical Copy Rules & Honest Labeling

- **Mandatory Simulated Badging**: Every report card, preview, and history card bears an amber `SIMULATED ANALYSIS` tag.
- **Non-Diagnostic Verbs**: In strict alignment with medical device safety standards, AI Skin Scanner never uses terms like *"diagnoses"*, *"confirms"*, *"detects"*, or *"treatment"*. Instead, all findings are framed as *"classifies"*, *"suggests"*, *"indicates"*, and *"educational analysis"*.
- **Action Verbs**: Buttons describe their exact mechanical function (*"Analyze my skin"*, *"Save to history"*), and toasts echo the identical verb (*"Saved to history"*, *"Deleted scan"*).

---

## 7. Known Limitations & Clinical Disclaimers

1. **Not for Skin Cancer**: AI Skin Scanner cannot identify, stage, or rule out melanoma, squamous cell carcinoma, or basal cell carcinoma. Suspicious pigmented or bleeding moles require high-magnification dermatoscopy and histological biopsy.
2. **Fitzpatrick Skin Tone Variability**: Erythema and subtle inflammatory borders present differently across Fitzpatrick skin phototypes IV–VI and may be underestimated by single-angle cameras.
3. **No Palpation Capability**: AI cannot palpate skin induration, warmth, regional lymphadenopathy, or depth of infiltration.
4. **Emergency Conditions**: Severe manifestations such as anaphylaxis, facial angioedema, rapidly advancing cellulitis, or bullous emergencies require immediate emergency department care.
