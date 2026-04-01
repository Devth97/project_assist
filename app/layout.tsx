import type { Metadata } from 'next'
import { Fraunces, Plus_Jakarta_Sans, Fira_Code } from 'next/font/google'
import './globals.css'

const fraunces = Fraunces({
  subsets:  ['latin'],
  variable: '--font-display',
  weight:   ['400', '700', '900'],
  style:    ['normal', 'italic'],
  display:  'swap',
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets:  ['latin'],
  variable: '--font-body',
  weight:   ['400', '500', '600', '700'],
  display:  'swap',
})

const firaCode = Fira_Code({
  subsets:  ['latin'],
  variable: '--font-mono',
  weight:   ['400', '500', '700'],
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
    <html lang="en" className={`${fraunces.variable} ${plusJakarta.variable} ${firaCode.variable}`}>
      <body className="font-body bg-offwhite text-ink antialiased">
        {children}
      </body>
    </html>
  )
}
