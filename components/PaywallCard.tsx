'use client'

import { useState } from 'react'
import { Repo } from '@/types'
import PayButton from './PayButton'

// Fake preview repos shown blurred behind the paywall
const PREVIEW_REPOS = [
  {
    name: 'owner/primary-implementation-repo',
    description: 'Complete implementation with all core modules and setup guides',
    stars: '1.2k',
    forks: '342',
    lang: 'Python',
  },
  {
    name: 'owner/supporting-library-repo',
    description: 'Supporting library with calibration utilities and example code',
    stars: '876',
    forks: '198',
    lang: 'C++',
  },
  {
    name: 'owner/reference-project-repo',
    description: 'Reference project with documentation and test suite',
    stars: '543',
    forks: '121',
    lang: 'TypeScript',
  },
]

interface PaywallCardProps {
  sessionId: string
  onSuccess: (repos: Repo[]) => void
}

export default function PaywallCard({ sessionId, onSuccess }: PaywallCardProps) {
  const [testStatus, setTestStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [testError,  setTestError]  = useState('')

  async function handleTestReveal() {
    setTestStatus('loading')
    setTestError('')
    try {
      const res  = await fetch('/api/test-reveal', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ session_id: sessionId }),
      })
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error ?? 'Reveal failed')
      onSuccess(data.repos)
      setTestStatus('idle')
    } catch (err) {
      setTestError(err instanceof Error ? err.message : 'Reveal failed')
      setTestStatus('error')
    }
  }

  return (
    <div className="animate-slide-up w-full max-w-2xl mx-auto mt-6">
      {/* Section header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-accent2/10 border border-accent2/20 text-accent2">
          🔒 Locked
        </span>
        <span className="text-xs text-text3">GitHub Repos &amp; Resources</span>
      </div>

      <div className="relative bg-card border border-white/7 rounded-2xl overflow-hidden">
        {/* Blurred preview cards */}
        <div className="p-4 space-y-3 select-none pointer-events-none" aria-hidden="true">
          {PREVIEW_REPOS.map((repo, i) => (
            <div
              key={i}
              className="bg-card2 border border-white/7 rounded-xl p-4"
              style={{ filter: 'blur(5px)', opacity: 0.45 }}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="font-mono text-sm font-semibold text-accent">{repo.name}</span>
              </div>
              <p className="text-text2 text-sm mb-3">{repo.description}</p>
              <div className="flex items-center gap-4 text-xs text-text3">
                <span>⭐ {repo.stars}</span>
                <span>🍴 {repo.forks}</span>
                <span>{repo.lang}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Paywall overlay */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
          style={{ background: 'linear-gradient(to bottom, rgba(10,14,26,0.7) 0%, rgba(10,14,26,0.97) 40%)' }}
        >
          <div className="text-4xl mb-4 filter drop-shadow-lg">🔒</div>
          <h3 className="font-syne font-bold text-xl text-white mb-2">
            3–5 curated repos are ready
          </h3>
          <p className="text-text2 text-sm leading-relaxed mb-1 max-w-sm">
            Instantly reveal GitHub repositories with star counts, descriptions, and AI relevance notes tailored to your project.
          </p>
          <p className="text-text3 text-xs mb-7">
            Each new idea re-locks the repos — you always get a fresh set.
          </p>

          <PayButton
            sessionId={sessionId}
            tier="repos"
            amount={20}
            onSuccess={onSuccess}
          />

          {/* ── TEST BYPASS — remove once Razorpay website is verified ── */}
          <div className="mt-3 flex flex-col items-center gap-1">
            <button
              onClick={handleTestReveal}
              disabled={testStatus === 'loading'}
              className="text-xs text-accent3 border border-accent3/30 hover:border-accent3/60 px-4 py-2 rounded-xl transition-all disabled:opacity-50"
            >
              {testStatus === 'loading' ? '⏳ Revealing…' : '🧪 Test Reveal (Free — Dev Only)'}
            </button>
            {testStatus === 'error' && (
              <p className="text-accent2 text-[11px]">{testError}</p>
            )}
          </div>
          {/* ── END TEST BYPASS ── */}

          <div className="mt-5 flex items-center gap-5 text-xs text-text3">
            <span className="flex items-center gap-1.5">
              <span className="text-accent3">✓</span> UPI / GPay / PhonePe
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-accent3">✓</span> Debit / Credit card
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-accent3">✓</span> Net banking
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
