-- ─────────────────────────────────────────────────────────────────────────────
-- EngineerKit AI — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── sessions ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sessions (
  id           uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      text,                                          -- Clerk/Auth user ID (nullable for guests)
  branch       text        NOT NULL,
  interest     text        NOT NULL,
  idea_json    jsonb,                                         -- Full Kimi output
  repos_json   jsonb,                                         -- Firecrawl/GitHub results — NEVER sent to frontend until paid
  repos_paid   boolean     DEFAULT false NOT NULL,
  kit_paid     boolean     DEFAULT false NOT NULL,
  kit_url      text,                                          -- Supabase Storage URL for ₹100 kit ZIP (future)
  created_at   timestamptz DEFAULT now() NOT NULL
);

-- ── payments ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
  id                    uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id            uuid        REFERENCES sessions(id) ON DELETE CASCADE,
  razorpay_order_id     text        UNIQUE NOT NULL,
  razorpay_payment_id   text,
  amount_paise          integer     NOT NULL,                 -- 2000 = ₹20, 10000 = ₹100
  tier                  text        NOT NULL                  -- 'repos' | 'kit'
                          CHECK (tier IN ('repos', 'kit')),
  status                text        DEFAULT 'pending' NOT NULL
                          CHECK (status IN ('pending', 'captured', 'failed', 'refunded')),
  created_at            timestamptz DEFAULT now() NOT NULL
);

-- ── scrape_cache ─────────────────────────────────────────────────────────────
-- Caches GitHub search results for 24 hours to save API calls and annotate latency
CREATE TABLE IF NOT EXISTS scrape_cache (
  query_hash   text        PRIMARY KEY,                       -- SHA256(title + tech_stack[0])
  repos_json   jsonb       NOT NULL,
  cached_at    timestamptz DEFAULT now() NOT NULL
);

-- ─────────────────────────────────────────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────────────────────────────────────────

-- Fast lookup by session for payment check
CREATE INDEX IF NOT EXISTS idx_sessions_created  ON sessions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_session  ON payments  (session_id);
CREATE INDEX IF NOT EXISTS idx_payments_order    ON payments  (razorpay_order_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────────────────────────────────────────
-- The anon key can never read repos_json or payments.
-- Only the service role key (used in API routes) can read/write these tables.

ALTER TABLE sessions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments    ENABLE ROW LEVEL SECURITY;
ALTER TABLE scrape_cache ENABLE ROW LEVEL SECURITY;

-- Block all public/anon access (API routes use service role which bypasses RLS)
CREATE POLICY "no_public_sessions"     ON sessions     FOR ALL TO anon USING (false);
CREATE POLICY "no_public_payments"     ON payments     FOR ALL TO anon USING (false);
CREATE POLICY "no_public_scrape_cache" ON scrape_cache FOR ALL TO anon USING (false);

-- ─────────────────────────────────────────────────────────────────────────────
-- AUTO-EXPIRE scrape_cache after 24h (optional pg_cron job)
-- Run this if your Supabase project has pg_cron enabled:
-- ─────────────────────────────────────────────────────────────────────────────
-- SELECT cron.schedule(
--   'expire-scrape-cache',
--   '0 * * * *',   -- every hour
--   $$DELETE FROM scrape_cache WHERE cached_at < now() - interval '24 hours'$$
-- );
