interface RazorpayPaymentResponse {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  order_id: string
  name: string
  description: string
  image?: string
  theme: { color: string }
  handler: (response: RazorpayPaymentResponse) => void
  prefill?: {
    name?: string
    email?: string
    contact?: string
  }
  notes?: Record<string, string>
  modal?: {
    ondismiss?: () => void
    escape?: boolean
    animation?: boolean
  }
}

interface RazorpayInstance {
  open(): void
  close(): void
  on(event: string, callback: (response: unknown) => void): void
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance
  }
}

export {}
