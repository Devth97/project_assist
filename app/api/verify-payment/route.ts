import { NextResponse } from 'next/server'
import { createHmac }   from 'crypto'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      session_id,
    } = (await req.json()) as {
      razorpay_order_id:   string
      razorpay_payment_id: string
      razorpay_signature:  string
      session_id:          string
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !session_id) {
      return NextResponse.json({ error: 'Missing required payment fields' }, { status: 400 })
    }

    // ── CRITICAL: Verify HMAC before unlocking anything ────────────────────
    const expected = createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (expected !== razorpay_signature) {
      console.warn('[verify-payment] Invalid signature for order:', razorpay_order_id)
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 401 })
    }

    // ── Get payment tier from DB ───────────────────────────────────────────
    const { data: payment } = await supabaseAdmin
      .from('payments')
      .select('tier, session_id')
      .eq('razorpay_order_id', razorpay_order_id)
      .single()

    if (!payment) {
      return NextResponse.json({ error: 'Payment record not found' }, { status: 404 })
    }

    const isRepos = payment.tier === 'repos'
    const isKit   = payment.tier === 'kit'

    // ── Mark session as paid ───────────────────────────────────────────────
    const updates: Record<string, boolean> = {}
    if (isRepos) updates.repos_paid = true
    if (isKit)   updates.kit_paid   = true

    await supabaseAdmin
      .from('sessions')
      .update(updates)
      .eq('id', session_id)

    // ── Update payment record ──────────────────────────────────────────────
    await supabaseAdmin
      .from('payments')
      .update({ status: 'captured', razorpay_payment_id })
      .eq('razorpay_order_id', razorpay_order_id)

    // ── Retrieve and return unlocked content ───────────────────────────────
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('sessions')
      .select('repos_json')
      .eq('id', session_id)
      .single()

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    return NextResponse.json({ repos: session.repos_json })
  } catch (err) {
    console.error('[verify-payment]', err)
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 })
  }
}
