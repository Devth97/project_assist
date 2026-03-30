import { NextResponse } from 'next/server'
import { createHmac }   from 'crypto'
import { supabaseAdmin } from '@/lib/supabase'

// Razorpay sends POST to this endpoint on payment.captured events.
// This is a server-to-server backup in case the client-side handler fails.
export async function POST(req: Request) {
  try {
    const body      = await req.text()
    const signature = req.headers.get('x-razorpay-signature') ?? ''

    // ── Verify webhook signature ─────────────────────────────────────────
    const expected = createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest('hex')

    if (expected !== signature) {
      console.warn('[webhook] Invalid webhook signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const event = JSON.parse(body) as RazorpayWebhookEvent

    if (event.event === 'payment.captured') {
      const payment   = event.payload.payment.entity
      const orderId   = payment.order_id
      const paymentId = payment.id
      const sessionId = payment.notes?.session_id
      const tier      = payment.notes?.tier

      if (!sessionId) {
        console.warn('[webhook] No session_id in payment notes for order:', orderId)
        return NextResponse.json({ received: true })
      }

      // Update DB (idempotent — upsert-like via eq filter)
      const updates: Record<string, boolean> = {}
      if (tier === 'repos') updates.repos_paid = true
      if (tier === 'kit')   updates.kit_paid   = true

      await supabaseAdmin
        .from('sessions')
        .update(updates)
        .eq('id', sessionId)

      await supabaseAdmin
        .from('payments')
        .update({ status: 'captured', razorpay_payment_id: paymentId })
        .eq('razorpay_order_id', orderId)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[razorpay-webhook]', err)
    // Return 200 so Razorpay doesn't retry on internal errors
    return NextResponse.json({ received: true, error: 'Internal error' })
  }
}

// ── Minimal Razorpay webhook type ─────────────────────────────────────────────
interface RazorpayWebhookEvent {
  event: string
  payload: {
    payment: {
      entity: {
        id:       string
        order_id: string
        notes?: {
          session_id?: string
          tier?:       string
        }
      }
    }
  }
}
