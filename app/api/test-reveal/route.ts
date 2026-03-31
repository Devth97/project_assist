/**
 * TEST-ONLY route — bypasses Razorpay payment verification.
 * Remove this file once the website is verified on Razorpay dashboard.
 */
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const { session_id } = (await req.json()) as { session_id: string }

    if (!session_id) {
      return NextResponse.json({ error: 'Missing session_id' }, { status: 400 })
    }

    const { data: session, error } = await supabaseAdmin
      .from('sessions')
      .select('repos_json')
      .eq('id', session_id)
      .single()

    if (error || !session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    if (!session.repos_json || session.repos_json.length === 0) {
      return NextResponse.json({ error: 'No repos found for this session' }, { status: 404 })
    }

    return NextResponse.json({ repos: session.repos_json })
  } catch (err) {
    console.error('[test-reveal]', err)
    return NextResponse.json({ error: 'Failed to reveal repos' }, { status: 500 })
  }
}
