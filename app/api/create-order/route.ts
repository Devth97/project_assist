import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { supabaseAdmin } from '@/lib/supabase'

let _razorpay: Razorpay | null = null
function getRazorpay() {
  if (!_razorpay) {
    _razorpay = new Razorpay({
      key_id:     process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    })
  }
  return _razorpay
}

export async function POST(req: Request) {
  try {
    const { session_id, tier } = (await req.json()) as {
      session_id: string
      tier: 'repos' | 'kit'
    }

    if (!session_id || !tier) {
      return NextResponse.json(
        { error: 'session_id and tier are required' },
        { status: 400 }
      )
    }

    if (!['repos', 'kit'].includes(tier)) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
    }

    // Verify session exists
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('sessions')
      .select('id, repos_paid, kit_paid')
      .eq('id', session_id)
      .single()

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Idempotency check: don't create a duplicate order if already paid
    if (tier === 'repos' && session.repos_paid) {
      return NextResponse.json({ error: 'Repos already unlocked for this session' }, { status: 409 })
    }
    if (tier === 'kit' && session.kit_paid) {
      return NextResponse.json({ error: 'Kit already purchased for this session' }, { status: 409 })
    }

    const amount = tier === 'repos' ? 2000 : 10000 // paise (₹20 or ₹100)

    // Create Razorpay order
    const order = await getRazorpay().orders.create({
      amount,
      currency: 'INR',
      receipt:  `${tier}_${session_id.slice(0, 20)}`,
      notes: {
        session_id,
        tier,
      },
    })

    // Record pending payment in DB
    await supabaseAdmin.from('payments').insert({
      session_id,
      razorpay_order_id: order.id,
      amount_paise:      amount,
      tier,
      status:            'pending',
    })

    return NextResponse.json({
      order_id: order.id,
      amount,
      key_id:   process.env.RAZORPAY_KEY_ID,
    })
  } catch (err) {
    console.error('[create-order]', err)
    return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 })
  }
}
