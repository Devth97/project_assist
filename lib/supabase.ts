import { createClient } from '@supabase/supabase-js'

// Browser client (uses anon key, subject to RLS)
export function createBrowserClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Server/admin client (uses service role key, bypasses RLS)
// Only import this in server-side code (API routes, Server Components)
let _supabaseAdmin: ReturnType<typeof createClient> | null = null
export function getSupabaseAdmin() {
  if (!_supabaseAdmin) {
    _supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )
  }
  return _supabaseAdmin
}
// Backwards-compatible alias — typed as any to avoid strict table typing without a schema
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabaseAdmin = new Proxy({} as any, {
  get(_target, prop) {
    return (getSupabaseAdmin() as any)[prop]
  },
})
