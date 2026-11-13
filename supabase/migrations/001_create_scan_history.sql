-- AI Skin Scanner: Localized Skin Lesion and Rash Classification System
-- Migration 001: Create scan_history table with Session-based RLS

-- Enable UUID extension if not already enabled
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

-- Index for rapid session-based queries
create index if not exists idx_scan_history_session_id on public.scan_history (session_id);
create index if not exists idx_scan_history_created_at on public.scan_history (created_at desc);

-- Enable Row Level Security
alter table public.scan_history enable row level security;

-- Policy: Allow read if session_id matches the requesting header/param
-- In Supabase anonymous client with custom session header, or matching column:
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
