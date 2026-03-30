'use client'

import { useState } from 'react'
import { Repo, CreateOrderResponse, VerifyPaymentResponse, PaymentTier } from '@/types'
import { cn } from '@/lib/utils'

interface PayButtonProps {
  sessionId: string
  tier: PaymentTier
  amount: number
  onSuccess: (repos: Repo[]) => void
  className?: string
}

export default function PayButton({ sessionId, tier, amount, onSuccess, className }: PayButtonProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handlePay() {
    setStatus('loading')
    setErrorMsg('')

    try {
      // 1. Create Razorpay order on the server
      const orderRes = await fetch('/api/create-order', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ session_id: sessionId, tier }),
      })
      const orderData: CreateOrderResponse = await orderRes.json()

      if (!orderRes.ok || orderData.error) {
        throw new Error(orderData.error ?? 'Failed to create payment order')
      }

      // 2. Check Razorpay is loaded (script loaded via layout)
      if (typeof window === 'undefined' || !window.Razorpay) {
        throw new Error('Razorpay SDK not loaded. Please refresh and try again.')
      }

      // 3. Open Razorpay checkout
      await new Promise<void>((resolve, reject) => {
        const rzp = new window.Razorpay({
          key:         orderData.key_id,
          amount:      orderData.amount,
          currency:    'INR',
          order_id:    orderData.order_id,
          name:        'EngineerKit AI',
          description: tier === 'repos'
            ? 'Unlock GitHub Repos for Your Project'
            : 'Complete Project Kit (PDF + PPT)',
          theme:       { color: '#6C63FF' },

          handler: async (response) => {
            try {
              // 4. Verify payment on the server and retrieve repos
              const verifyRes = await fetch('/api/verify-payment', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({
                  razorpay_order_id:   response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature:  response.razorpay_signature,
                  session_id:          sessionId,
                }),
              })
              const verifyData: VerifyPaymentResponse = await verifyRes.json()

              if (!verifyRes.ok || verifyData.error) {
                reject(new Error(verifyData.error ?? 'Payment verification failed'))
                return
              }

              if (verifyData.repos) {
                onSuccess(verifyData.repos)
                setStatus('idle')
              }
              resolve()
            } catch (err) {
              reject(err)
            }
          },

          modal: {
            ondismiss: () => {
              setStatus('idle')
              resolve()
            },
          },
        })
        rzp.open()
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Payment failed. Please try again.'
      setErrorMsg(msg)
      setStatus('error')
    }
  }

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <button
        onClick={handlePay}
        disabled={status === 'loading'}
        className={cn(
          'flex items-center gap-3 px-8 py-4 rounded-2xl font-syne font-bold text-base',
          'bg-accent hover:bg-accent/90 text-white transition-all',
          'shadow-lg shadow-accent/30 hover:shadow-accent/40',
          'disabled:opacity-60 disabled:cursor-not-allowed',
          'active:scale-[0.98]',
        )}
      >
        {status === 'loading' ? (
          <>
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Processing…
          </>
        ) : (
          <>
            <span className="text-xl">💳</span>
            Pay ₹{amount} via UPI / Card
          </>
        )}
      </button>

      {status === 'error' && (
        <p className="text-accent2 text-xs text-center max-w-xs">
          {errorMsg}
        </p>
      )}
    </div>
  )
}
