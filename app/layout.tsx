import type { Metadata } from 'next'
import { Bricolage_Grotesque, Fira_Code, Outfit } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const bricolage = Bricolage_Grotesque({
  subsets:  ['latin'],
  variable: '--font-display',
  weight:   ['400', '600', '700', '800'],
  display:  'swap',
})

const firaCode = Fira_Code({
  subsets:  ['latin'],
  variable: '--font-mono',
  weight:   ['400', '500', '700'],
  display:  'swap',
})

const outfit = Outfit({
  subsets:  ['latin'],
  variable: '--font-body',
  weight:   ['400', '500', '600'],
  display:  'swap',
})

export const metadata: Metadata = {
  title:       'EngineerKit AI — Project Idea Generator for Indian Engineering Students',
  description: 'AI-powered project idea generator tailored for Indian engineering students. Get curated GitHub repos for your final year project — completely free.',
  keywords:    'engineering project ideas, final year project, Indian engineering students, VTU projects, GitHub repos, AI project generator',
  openGraph: {
    title:       'EngineerKit AI',
    description: 'Generate original engineering project ideas + get curated GitHub repos — free.',
    type:        'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${firaCode.variable} ${outfit.variable}`}>
      <body className="font-body bg-bg text-text antialiased">
        {children}
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      </body>
    </html>
  )
}
