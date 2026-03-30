import type { Metadata } from 'next'
import { Syne, JetBrains_Mono, Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const syne = Syne({
  subsets:  ['latin'],
  variable: '--font-syne',
  weight:   ['400', '700', '800'],
  display:  'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets:  ['latin'],
  variable: '--font-mono',
  weight:   ['400', '500'],
  display:  'swap',
})

const inter = Inter({
  subsets:  ['latin'],
  variable: '--font-inter',
  weight:   ['400', '500', '600'],
  display:  'swap',
})

export const metadata: Metadata = {
  title:       'EngineerKit AI — Project Idea Generator for Indian Engineering Students',
  description: 'AI-powered project idea generator tailored for Indian engineering students. Get curated GitHub repos for your final year project. Pay ₹20 to unlock real repos.',
  keywords:    'engineering project ideas, final year project, Indian engineering students, VTU projects, GitHub repos, AI project generator',
  openGraph: {
    title:       'EngineerKit AI',
    description: 'Generate original engineering project ideas + get curated GitHub repos for ₹20',
    type:        'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${jetbrainsMono.variable} ${inter.variable}`}>
      <body className="font-inter bg-bg text-text antialiased">
        {children}
        {/* Razorpay checkout SDK — loaded lazily so it doesn't block initial paint */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  )
}
