'use client'

import { useState, useCallback } from 'react'
import IdeaForm  from '@/components/IdeaForm'
import IdeaCard  from '@/components/IdeaCard'
import RepoCard  from '@/components/RepoCard'
import { ProjectIdea, Repo, GenerateIdeaResponse } from '@/types'

type AppState = 'idle' | 'generating' | 'done' | 'error'

const STEPS = [
  { n: '01', label: 'Select Branch & Interest' },
  { n: '02', label: 'AI Generates Your Idea'   },
  { n: '03', label: 'GitHub Repos Revealed'     },
]

const STATS = [
  { value: '10+',  label: 'Branches'   },
  { value: '15+',  label: 'Interests'  },
  { value: '100%', label: 'Original'   },
  { value: 'Free', label: 'Always'     },
]

export default function HomePage() {
  const [appState,  setAppState]  = useState<AppState>('idle')
  const [idea,      setIdea]      = useState<ProjectIdea | null>(null)
  const [repos,     setRepos]     = useState<Repo[] | null>(null)
  const [error,     setError]     = useState<string | null>(null)

  const handleGenerate = useCallback(async (branch: string, interest: string, year: string) => {
    setAppState('generating')
    setError(null)
    setIdea(null)
    setRepos(null)

    try {
      // Step 1 — generate idea + store repos in DB
      const res = await fetch('/api/generate-idea', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ branch, interest, year }),
      })

      let data: GenerateIdeaResponse
      try { data = await res.json() }
      catch { throw new Error('Server took too long. Please try again.') }

      if (!res.ok || data.error) throw new Error(data.error ?? 'Failed to generate idea')

      setIdea(data.idea)

      // Step 2 — auto-reveal repos (free for all)
      const revealRes = await fetch('/api/test-reveal', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ session_id: data.session_id }),
      })
      const revealData = await revealRes.json()
      if (revealRes.ok && revealData.repos) setRepos(revealData.repos)

      setAppState('done')
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setAppState('error')
    }
  }, [])

  const handleReset = useCallback(() => {
    setAppState('idle')
    setIdea(null)
    setRepos(null)
    setError(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const isGenerating = appState === 'generating'

  return (
    <main className="min-h-screen bg-bg">

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pt-24 pb-20 flex flex-col items-center text-center">

        {/* Dot grid */}
        <div className="absolute inset-0 dot-grid opacity-35 pointer-events-none" />

        {/* Amber radial glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(240,125,12,0.13) 0%, transparent 65%)' }}
        />

        {/* Badge */}
        <div className="relative mb-10 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber/20 bg-amber/5 text-amber font-mono text-xs uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse-slow" />
          AI Project Idea Generator · v2
        </div>

        {/* Hero title */}
        <h1
          className="relative font-display font-extrabold leading-[0.9] tracking-tight mb-6"
          style={{ fontSize: 'clamp(56px, 11vw, 128px)' }}
        >
          <span className="block text-text">ENGINEER</span>
          <span className="block">
            <span className="text-text">KIT </span>
            <span className="text-amber">AI.</span>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="relative text-text2 text-lg max-w-md leading-relaxed mb-3 font-body">
          Generate original project ideas for your semester.<br />
          Get curated GitHub repos — <span className="text-amber font-semibold">completely free</span>.
        </p>

        {/* Mono powered-by line */}
        <p className="relative font-mono text-text3 text-xs mb-14 tracking-wide">
          <span className="text-amber/50">$</span> llama-3.3-70b · live github search · built for india
        </p>

        {/* Steps */}
        <div className="relative flex flex-wrap justify-center gap-2 mb-14">
          {STEPS.map(s => (
            <div
              key={s.n}
              className="flex items-center gap-2.5 px-4 py-2 rounded-lg border border-amber/12 bg-amber/4 text-xs font-mono"
            >
              <span className="text-amber/50">{s.n}</span>
              <span className="text-text2">{s.label}</span>
              <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] bg-emerald/10 border border-emerald/20 text-emerald font-bold">FREE</span>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="relative flex flex-wrap justify-center gap-10">
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <div className="font-display font-bold text-2xl text-amber">{s.value}</div>
              <div className="text-text3 font-mono text-xs mt-0.5 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Bottom divider */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber/20 to-transparent" />
      </section>

      {/* ── FORM + RESULTS ───────────────────────────────────────────────────── */}
      <section className="max-w-2xl mx-auto px-6 py-16 space-y-12">

        {/* Form block */}
        {(appState === 'idle' || appState === 'error' || appState === 'done') && (
          <div className={appState === 'done' ? 'opacity-60 hover:opacity-100 transition-opacity duration-300' : ''}>
            {appState === 'done' && (
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-px bg-amber" />
                  <span className="font-mono text-amber text-sm uppercase tracking-widest">Generate Another</span>
                </div>
                <button
                  onClick={handleReset}
                  className="font-mono text-xs text-text3 hover:text-amber border border-white/8 hover:border-amber/30 px-3 py-1.5 rounded-lg transition-all"
                >
                  ↺ Start fresh
                </button>
              </div>
            )}
            <IdeaForm onSubmit={handleGenerate} isLoading={isGenerating} />
          </div>
        )}

        {/* Error */}
        {(appState === 'error') && error && (
          <div className="animate-fade-in bg-rose/5 border border-rose/20 rounded-2xl px-5 py-5 flex items-start gap-4">
            <span className="text-rose text-xl mt-0.5">⚠</span>
            <div className="flex-1">
              <p className="text-rose font-semibold text-sm mb-1 font-body">Something went wrong</p>
              <p className="text-text2 text-sm leading-relaxed font-body">{error}</p>
              <button
                onClick={() => { setError(null); setAppState('idle') }}
                className="mt-3 font-mono text-xs text-text3 hover:text-amber underline underline-offset-2"
              >
                Dismiss and try again
              </button>
            </div>
          </div>
        )}

        {/* Generating */}
        {appState === 'generating' && (
          <div className="animate-fade-in flex flex-col items-center py-16 space-y-8 text-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-amber/10 border border-amber/20 flex items-center justify-center animate-amber-pulse">
                <span className="text-3xl animate-float">⚡</span>
              </div>
              <div className="absolute -inset-2 rounded-3xl border border-amber/15 animate-ping opacity-20" />
            </div>
            <div>
              <p className="font-display font-bold text-xl text-text mb-2">Generating Your Idea</p>
              <p className="text-text3 font-mono text-xs">
                <span className="text-amber">llama-3.3-70b</span> is crafting + fetching repos...
              </p>
            </div>
            <LoadingSteps />
          </div>
        )}

        {/* Results */}
        {appState === 'done' && idea && (
          <div className="space-y-6" id="results">
            <IdeaCard idea={idea} />

            {repos && repos.length > 0 && (
              <div className="animate-fade-in">
                {/* Repos header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-emerald/8 border border-emerald/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse-slow" />
                    <span className="font-mono text-xs text-emerald uppercase tracking-widest">Unlocked</span>
                  </div>
                  <span className="font-mono text-xs text-text3">
                    {repos.length} github repos curated for your project
                  </span>
                </div>

                <div className="space-y-3">
                  {repos.map((repo, i) => (
                    <RepoCard key={repo.url} repo={repo} index={i} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-amber/8 py-10 text-center px-6">
        <p className="font-display font-bold text-text text-sm mb-1">EngineerKit AI</p>
        <p className="font-mono text-text3 text-xs">
          Built for Indian engineering students · AI by Llama 3.3 70B via NVIDIA NIM · Repos from GitHub
        </p>
      </footer>
    </main>
  )
}

function LoadingSteps() {
  const steps = [
    { icon: '⚡', label: 'Crafting your project idea...',  active: true  },
    { icon: '⭐', label: 'Searching GitHub repos...',      active: false },
    { icon: '🎯', label: 'Ranking & storing results...',   active: false },
  ]
  return (
    <div className="w-full max-w-sm space-y-2">
      {steps.map((s, i) => (
        <div
          key={i}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border font-mono text-sm transition-all ${
            s.active
              ? 'bg-amber/5 border-amber/20 text-text2'
              : 'bg-surface border-white/5 text-text3 opacity-35'
          }`}
        >
          <span>{s.icon}</span>
          <span>{s.label}</span>
          {s.active && (
            <span className="ml-auto w-3.5 h-3.5 border-2 border-amber/30 border-t-amber rounded-full animate-spin" />
          )}
        </div>
      ))}
    </div>
  )
}
