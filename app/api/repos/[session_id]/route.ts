import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Protected retrieval endpoint — returns repos only after server confirms repos_paid = true.
// Used for page reload / session restore scenarios.
export async function GET(
  _req: Request,
  { params }: { params: { session_id: string } }
) {
  try {
    const { session_id } = params

    if (!session_id) {
      return NextResponse.json({ error: 'session_id is required' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('sessions')
      .select('repos_json, repos_paid')
      .eq('id', session_id)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Guard: never return repos without confirmed payment
    if (!data.repos_paid) {
      return NextResponse.json({ error: 'Payment required to access repos' }, { status: 401 })
    }

    return NextResponse.json({ repos: data.repos_json })
  } catch (err) {
    console.error('[repos/session_id]', err)
    return NextResponse.json({ error: 'Failed to retrieve repos' }, { status: 500 })
  }
}
