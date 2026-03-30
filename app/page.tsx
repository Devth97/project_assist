'use client'

import { useState, useCallback } from 'react'
import IdeaForm    from '@/components/IdeaForm'
import IdeaCard    from '@/components/IdeaCard'
import PaywallCard from '@/components/PaywallCard'
import RepoCard    from '@/components/RepoCard'
import { ProjectIdea, Repo, AppState, GenerateIdeaResponse } from '@/types'

// ── Stat counter strip ────────────────────────────────────────────────────────
const STATS = [
  { value: '10+', label: 'Engineering Branches' },
  { value: '15+', label: 'Interest Areas' },
  { value: '₹20', label: 'Per Reveal' },
]

// ── Step indicator ────────────────────────────────────────────────────────────
const STEPS = [
  { n: '01', label: 'Select Branch & Interest', free: true  },
  { n: '02', label: 'AI Generates Your Idea',   free: true  },
  { n: '03', label: 'Repos Found & Locked',      free: false },
  { n: '04', label: 'Pay ₹20 to Reveal',         free: false },
]

export default function HomePage() {
  const [appState,  setAppState]  = useState<AppState>('idle')
  const [idea,      setIdea]      = useState<ProjectIdea | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [repos,     setRepos]     = useState<Repo[] | null>(null)
  const [error,     setError]     = useState<string | null>(null)

  // ── Generate idea ───────────────────────────────────────────────────────────
  const handleGenerate = useCallback(async (branch: string, interest: string, year: string) => {
    setAppState('generating')
    setError(null)
    setIdea(null)
    setRepos(null)
    setSessionId(null)

    try {
      const res  = await fetch('/api/generate-idea', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ branch, interest, year }),
      })
      const data: GenerateIdeaResponse = await res.json()

      if (!res.ok || data.error) throw new Error(data.error ?? 'Failed to generate idea')

      setIdea(data.idea)
      setSessionId(data.session_id)
      setAppState('idea_ready')

      // Scroll to results
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setAppState('idle')
    }
  }, [])

  // ── Payment success ─────────────────────────────────────────────────────────
  const handlePaymentSuccess = useCallback((unlockedRepos: Repo[]) => {
    setRepos(unlockedRepos)
    setAppState('repos_revealed')
    setTimeout(() => {
      document.getElementById('repos-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }, [])

  // ── Reset ───────────────────────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    setAppState('idle')
    setIdea(null)
    setSessionId(null)
    setRepos(null)
    setError(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const isGenerating = appState === 'generating'

  return (
    <main className="min-h-screen bg-bg">

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-white/7 px-6 py-20 text-center">
        {/* Glow */}
        <div
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-32 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(108,99,255,0.16) 0%, transparent 70%)' }}
          aria-hidden="true"
        />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-xs font-semibold text-accent/90 uppercase tracking-widest mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-slow" />
          AI Project Idea Generator — v1
        </div>

        {/* Title */}
        <h1
          className="font-syne font-extrabold leading-none tracking-tight mb-5"
          style={{
            fontSize: 'clamp(36px, 6vw, 72px)',
            background: 'linear-gradient(135deg, #fff 0%, #9B96FF 50%, #6C63FF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          EngineerKit AI
        </h1>

        <p className="text-text2 text-lg leading-relaxed max-w-lg mx-auto mb-4">
          Generate original project ideas for your semester. Unlock real GitHub repos for ₹20.
        </p>
        <p className="text-text3 text-sm mb-12">
          Powered by Kimi K2.5 · Live GitHub search · Razorpay UPI
        </p>

        {/* Steps strip */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {STEPS.map(s => (
            <div
              key={s.n}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-medium"
              style={{
                background: s.free ? 'rgba(0,217,163,0.05)' : 'rgba(108,99,255,0.05)',
                borderColor: s.free ? 'rgba(0,217,163,0.2)' : 'rgba(108,99,255,0.2)',
                color: s.free ? '#00D9A3' : '#9B96FF',
              }}
            >
              <span className="font-mono opacity-60">{s.n}</span>
              {s.label}
              {s.free
                ? <span className="bg-accent3/10 text-accent3 text-[10px] px-1.5 py-0.5 rounded-md border border-accent3/20 font-bold">FREE</span>
                : <span className="bg-accent/10 text-accent text-[10px] px-1.5 py-0.5 rounded-md border border-accent/20 font-bold">₹20</span>
              }
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8">
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <div className="font-syne font-bold text-2xl text-white">{s.value}</div>
              <div className="text-text3 text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FORM + RESULTS ──────────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-16 space-y-12" id="results">

        {/* Form — shown in idle state and also after results (for re-generating) */}
        {(appState === 'idle' || appState === 'idea_ready' || appState === 'repos_revealed') && (
          <div className={appState !== 'idle' ? 'opacity-60 hover:opacity-100 transition-opacity' : ''}>
            {appState !== 'idle' && (
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-syne font-bold text-lg text-white">Generate Another Idea</h2>
                <button
                  onClick={handleReset}
                  className="text-xs text-text3 hover:text-text2 border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg transition-all"
                >
                  ↺ Start fresh
                </button>
              </div>
            )}
            <IdeaForm onSubmit={handleGenerate} isLoading={isGenerating} />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="animate-fade-in bg-accent2/5 border border-accent2/20 rounded-xl px-5 py-4 text-accent2 text-sm">
            <strong>Error: </strong>{error}
          </div>
        )}

        {/* Generating state */}
        {appState === 'generating' && (
          <div className="animate-fade-in flex flex-col items-center py-16 space-y-6 text-center">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                <span className="text-2xl">🤖</span>
              </div>
              <div className="absolute -inset-1 rounded-2xl border border-accent/30 animate-ping opacity-30" />
            </div>
            <div>
              <p className="font-syne font-bold text-lg text-white mb-1">Kimi K2.5 is thinking…</p>
              <p className="text-text3 text-sm">Generating your idea + searching GitHub for real repos</p>
            </div>
            <LoadingSteps />
          </div>
        )}

        {/* Idea card + paywall / repos */}
        {(appState === 'idea_ready' || appState === 'repos_revealed') && idea && (
          <div className="space-y-8">
            <IdeaCard idea={idea} />

            {appState === 'idea_ready' && sessionId && (
              <PaywallCard sessionId={sessionId} onSuccess={handlePaymentSuccess} />
            )}

            {appState === 'repos_revealed' && repos && repos.length > 0 && (
              <div className="animate-fade-in" id="repos-section">
                {/* Unlocked header */}
                <div className="flex items-center gap-2 mb-5">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-accent3/10 border border-accent3/20 text-accent3">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent3" />
                    Unlocked
                  </span>
                  <span className="text-xs text-text3">
                    {repos.length} GitHub repos curated for your project
                  </span>
                </div>

                <div className="space-y-4">
                  {repos.map((repo, i) => (
                    <RepoCard key={repo.url} repo={repo} index={i} />
                  ))}
                </div>

                {/* Upsell card */}
                <div className="mt-8 bg-card border border-accent4/20 rounded-2xl p-6 text-center">
                  <div className="text-2xl mb-3">📦</div>
                  <h3 className="font-syne font-bold text-base text-white mb-1">
                    Want the complete project kit?
                  </h3>
                  <p className="text-text2 text-sm leading-relaxed mb-5">
                    Get a full PDF report (abstract, literature review, methodology) + 10-slide PPT with viva notes — ready to submit.
                  </p>
                  <button
                    className="px-6 py-3 rounded-xl font-semibold text-sm bg-accent4/15 border border-accent4/30 text-accent4 hover:bg-accent4/20 transition-all"
                    onClick={() => alert('Kit generation coming soon! Your session ID: ' + sessionId)}
                  >
                    Unlock Full Kit for ₹100
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/7 py-10 text-center text-xs text-text3 px-6">
        <p className="mb-2">
          <strong className="text-text2">EngineerKit AI</strong> — Built for Indian engineering students
        </p>
        <p className="text-text3/60">
          Payments secured by Razorpay · Repos sourced live from GitHub · AI by Kimi K2.5 via NVIDIA NIM
        </p>
      </footer>
    </main>
  )
}

// ── Loading sub-component ─────────────────────────────────────────────────────
function LoadingSteps() {
  const steps = [
    { icon: '🧠', label: 'Crafting your project idea…',      done: true  },
    { icon: '🔍', label: 'Searching GitHub for real repos…', done: false },
    { icon: '✨', label: 'Writing AI relevance notes…',       done: false },
  ]

  return (
    <div className="space-y-2 text-left w-full max-w-xs">
      {steps.map((s, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-card border border-white/7 text-sm"
          style={{ opacity: i === 0 ? 1 : 0.4 }}
        >
          <span>{s.icon}</span>
          <span className="text-text2">{s.label}</span>
          {i === 0 && (
            <span className="ml-auto w-3.5 h-3.5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          )}
        </div>
      ))}
    </div>
  )
}
