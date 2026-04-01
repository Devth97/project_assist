'use client'

import { useState, useCallback, useRef } from 'react'
import IdeaForm from '@/components/IdeaForm'
import IdeaCard from '@/components/IdeaCard'
import RepoCard from '@/components/RepoCard'
import { ProjectIdea, Repo, GenerateIdeaResponse } from '@/types'

type AppState = 'idle' | 'generating' | 'done' | 'error'

const TAGS = [
  'Machine Learning', 'IoT', 'Web Development', 'Computer Vision', 'NLP', 'Blockchain',
  'AR / VR', 'Cybersecurity', 'Cloud Computing', 'Deep Learning', 'Flutter', 'React',
  'Python', 'TensorFlow', 'OpenCV', 'FastAPI', 'Supabase', 'Firebase',
  'Node.js', 'Next.js', 'Robotics', 'Embedded Systems', 'Data Analytics',
  'Edge Computing', 'Mobile Dev', 'TypeScript', 'Docker', 'Kubernetes',
]

const HOW_IT_WORKS = [
  {
    n: '01',
    title: 'Pick Your Stack',
    body: 'Select your engineering branch, area of interest, and academic year.',
    color: '#6C4CF1',
  },
  {
    n: '02',
    title: 'AI Crafts Your Idea',
    body: 'Llama 3.3 70B generates a unique, original project idea tailored just for you.',
    color: '#F07D0C',
  },
  {
    n: '03',
    title: 'Get GitHub Repos',
    body: 'Curated real GitHub repos matching your tech stack — revealed instantly, 100% free.',
    color: '#10B981',
  },
]

const VALUES = [
  { icon: '⚡', title: 'Instant Generation', body: 'No sign-up, no waiting. Your unique project idea in under 30 seconds.' },
  { icon: '🎯', title: '100% Original', body: 'Every idea is freshly AI-generated for your exact branch and interest.' },
  { icon: '🔓', title: 'Always Free', body: 'No paywall, no credits, no hidden costs. GitHub repos revealed for free.' },
  { icon: '🇮🇳', title: 'Built for India', body: 'Tailored for VTU, Anna University, JNTUH & other Indian engineering curricula.' },
]

export default function HomePage() {
  const [appState, setAppState] = useState<AppState>('idle')
  const [idea,     setIdea]     = useState<ProjectIdea | null>(null)
  const [repos,    setRepos]    = useState<Repo[] | null>(null)
  const [error,    setError]    = useState<string | null>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  const handleGenerate = useCallback(async (branch: string, interest: string, year: string) => {
    setAppState('generating')
    setError(null)
    setIdea(null)
    setRepos(null)

    try {
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

      // Auto-reveal repos (free for all)
      const revealRes = await fetch('/api/test-reveal', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ session_id: data.session_id }),
      })
      const revealData = await revealRes.json()
      if (revealRes.ok && revealData.repos) setRepos(revealData.repos)

      setAppState('done')
      setTimeout(() => {
        outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 150)
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

  return (
    <div className="min-h-screen bg-offwhite">

      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-offwhite/90 backdrop-blur-md border-b border-ink/8 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="font-display font-black text-ink text-xl">EngineerKit</span>
            <span className="font-display font-black text-purple text-xl">AI</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:flex items-center gap-1.5 font-mono text-xs text-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse-slow" />
              Free for all students
            </span>
            <button
              onClick={() => document.getElementById('hero-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-5 py-2.5 bg-ink text-offwhite font-body text-sm font-semibold rounded-xl hover:bg-ink/80 transition-all active:scale-95"
            >
              Get Started →
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO + FORM ────────────────────────────────────────────────────── */}
      <section
        id="hero-form"
        className="relative overflow-hidden"
        style={{ background: '#EAD8C0' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[88vh]">

          {/* LEFT — Heading + Form */}
          <div className="relative z-10">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ink/8 border border-ink/12 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-purple" />
              <span className="font-mono text-xs text-ink/60 uppercase tracking-widest">
                AI · Free · Indian Engineering
              </span>
            </div>

            {/* Heading */}
            <h1
              className="font-display font-black text-ink leading-[0.88] tracking-tight mb-6"
              style={{ fontSize: 'clamp(44px, 6.5vw, 80px)' }}
            >
              Turn Your<br />
              Semester Into<br />
              <span className="text-purple italic">A Project.</span>
            </h1>

            {/* Subtext */}
            <p className="font-body text-ink/65 text-lg leading-relaxed mb-10 max-w-md">
              Get a unique AI-generated engineering project idea + curated
              GitHub repos. <strong className="text-ink font-semibold">Completely free</strong> for Indian students.
            </p>

            {/* Form container */}
            <div
              id="hero-form-box"
              className="bg-white/75 backdrop-blur-sm rounded-2xl p-6 border border-ink/8 shadow-lg shadow-ink/5"
            >
              <IdeaForm onSubmit={handleGenerate} isLoading={appState === 'generating'} />
            </div>

            {/* Error */}
            {appState === 'error' && error && (
              <div className="mt-4 animate-fade-in bg-red-50 border border-red-200 rounded-xl px-4 py-4 flex items-start gap-3">
                <span className="text-red-500 text-lg mt-0.5">⚠</span>
                <div>
                  <p className="text-red-700 font-semibold text-sm font-body">{error}</p>
                  <button
                    onClick={() => { setError(null); setAppState('idle') }}
                    className="mt-1 font-mono text-xs text-red-500 underline underline-offset-2"
                  >
                    Try again
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT — Floating circles illustration */}
          <div className="relative hidden lg:flex items-center justify-center h-[520px]">
            {/* Central circle */}
            <div className="absolute w-72 h-72 rounded-full border-2 border-purple/25 flex items-center justify-center animate-float-1"
              style={{ background: 'radial-gradient(circle, rgba(108,76,241,0.15) 0%, rgba(108,76,241,0.05) 100%)' }}
            >
              <div className="w-44 h-44 rounded-full border-2 border-purple/30 flex items-center justify-center"
                style={{ background: 'rgba(108,76,241,0.18)' }}
              >
                <span className="text-5xl select-none">⚡</span>
              </div>
            </div>

            {/* Orbit circles */}
            <div className="absolute top-10 right-16 w-24 h-24 rounded-full border-2 border-yellow/60 flex items-center justify-center animate-float-2"
              style={{ background: 'rgba(255,216,77,0.55)' }}
            >
              <span className="text-2xl select-none">🎯</span>
            </div>

            <div className="absolute bottom-20 right-10 w-16 h-16 rounded-full border-2 border-ink/20 flex items-center justify-center animate-float-3"
              style={{ background: 'rgba(13,13,13,0.08)' }}
            >
              <span className="text-lg select-none">🔬</span>
            </div>

            <div className="absolute top-24 left-8 w-20 h-20 rounded-full border-2 flex items-center justify-center animate-float-4"
              style={{ background: 'rgba(16,185,129,0.18)', borderColor: 'rgba(16,185,129,0.4)' }}
            >
              <span className="text-xl select-none">💻</span>
            </div>

            <div className="absolute bottom-10 left-20 w-14 h-14 rounded-full border-2 flex items-center justify-center animate-float-5"
              style={{ background: 'rgba(244,63,94,0.15)', borderColor: 'rgba(244,63,94,0.3)' }}
            >
              <span className="text-base select-none">🚀</span>
            </div>

            {/* Small accent dots */}
            <div className="absolute top-1/2 right-6 w-10 h-10 rounded-full border border-purple/40 animate-float-1 bg-purple/20" style={{ animationDelay: '1s' }} />
            <div className="absolute top-36 left-1/4 w-7 h-7 rounded-full border border-yellow/50 animate-float-3 bg-yellow/35" style={{ animationDelay: '0.6s' }} />
            <div className="absolute bottom-36 left-1/3 w-5 h-5 rounded-full border border-ink/20 animate-float-2 bg-ink/10" style={{ animationDelay: '1.5s' }} />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────────────── */}
      {appState !== 'done' && (
        <section className="bg-offwhite px-6 py-24">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="font-mono text-xs text-muted uppercase tracking-widest mb-4">How It Works</p>
              <h2 className="font-display font-black text-ink text-4xl md:text-5xl leading-tight">
                Three steps.<br />Zero friction.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {HOW_IT_WORKS.map((step) => (
                <div
                  key={step.n}
                  className="relative bg-white rounded-2xl p-7 border border-ink/6 hover:border-ink/15 hover:-translate-y-1 transition-all duration-200 shadow-sm hover:shadow-md cursor-default"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 font-mono font-bold text-sm text-white"
                    style={{ background: step.color }}
                  >
                    {step.n}
                  </div>
                  <h3 className="font-display font-bold text-ink text-xl mb-2">{step.title}</h3>
                  <p className="font-body text-muted text-sm leading-relaxed">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── GENERATING STATE ───────────────────────────────────────────────── */}
      {appState === 'generating' && (
        <section className="bg-offwhite px-6 py-24">
          <div className="max-w-sm mx-auto text-center space-y-8">
            <div className="relative inline-block">
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center animate-purple-pulse"
                style={{ background: 'rgba(108,76,241,0.1)', border: '2px solid rgba(108,76,241,0.2)' }}
              >
                <span className="text-3xl select-none">⚡</span>
              </div>
              <div className="absolute -inset-2 rounded-3xl border-2 border-purple/20 animate-ping opacity-30" />
            </div>

            <div>
              <p className="font-display font-bold text-ink text-2xl mb-2">Generating Your Idea</p>
              <p className="font-mono text-muted text-xs">llama-3.3-70b is crafting + searching GitHub...</p>
            </div>

            <div className="space-y-2 w-full">
              {[
                { icon: '⚡', label: 'Crafting your project idea...',  active: true  },
                { icon: '⭐', label: 'Searching GitHub repos...',       active: false },
                { icon: '🎯', label: 'Ranking & storing results...',    active: false },
              ].map((s, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-mono transition-all ${
                    s.active
                      ? 'bg-purple/5 border-purple/20 text-ink'
                      : 'bg-white border-ink/8 text-muted opacity-40'
                  }`}
                >
                  <span>{s.icon}</span>
                  <span>{s.label}</span>
                  {s.active && (
                    <span className="ml-auto w-4 h-4 border-2 border-purple/30 border-t-purple rounded-full animate-spin" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── OUTPUT SECTION ─────────────────────────────────────────────────── */}
      {appState === 'done' && idea && (
        <section
          ref={outputRef}
          id="results"
          className="px-6 py-20"
          style={{ background: 'linear-gradient(135deg, #6C4CF1 0%, #8B5CF6 100%)' }}
        >
          <div className="max-w-7xl mx-auto">
            {/* Section header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
              <div>
                <p className="font-mono text-white/50 text-xs uppercase tracking-widest mb-1">Your Results</p>
                <h2 className="font-display font-black text-white text-3xl md:text-4xl">
                  Here&apos;s your project idea.
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => document.getElementById('hero-form-box')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-body text-sm font-semibold rounded-xl transition-all"
                >
                  ↺ Generate Another
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2.5 bg-white text-purple font-body text-sm font-semibold rounded-xl hover:bg-white/90 transition-all shadow-lg"
                >
                  Start Fresh
                </button>
              </div>
            </div>

            {/* Two-column output */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

              {/* LEFT — Idea Card */}
              <div className="animate-scale-in">
                <p className="font-mono text-white/50 text-xs uppercase tracking-widest mb-4">
                  ✦ Your AI-Generated Idea
                </p>
                <IdeaCard idea={idea} />
              </div>

              {/* RIGHT — Repo Cards */}
              <div className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-emerald animate-pulse-slow" />
                  <p className="font-mono text-white/50 text-xs uppercase tracking-widest">
                    {repos?.length ?? 0} Curated GitHub Repos — Free
                  </p>
                </div>

                {repos && repos.length > 0 ? (
                  <div className="space-y-3">
                    {repos.map((repo, i) => (
                      <RepoCard key={repo.url} repo={repo} index={i} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white/10 rounded-2xl p-8 text-center border border-white/15">
                    <p className="text-white/60 font-mono text-sm">No repos found for this tech stack.</p>
                    <p className="text-white/40 font-mono text-xs mt-1">Try generating with a different interest.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── SCROLLING TAGS TICKER ──────────────────────────────────────────── */}
      <section className="bg-ink overflow-hidden py-5 border-y border-white/6">
        <div className="ticker-wrapper">
          <div className="ticker-track">
            {[...TAGS, ...TAGS].map((tag, i) => (
              <span
                key={i}
                className="flex-shrink-0 mx-5 font-mono text-sm text-white/55 uppercase tracking-wider whitespace-nowrap"
              >
                {tag}
                <span className="ml-5 text-purple/50">·</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUE SECTION ──────────────────────────────────────────────────── */}
      <section className="px-6 py-24" style={{ background: '#FFD84D' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-mono text-xs text-ink/45 uppercase tracking-widest mb-4">Why EngineerKit AI?</p>
            <h2 className="font-display font-black text-ink text-4xl md:text-5xl leading-tight">
              The fastest way to start<br />your final year project.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {VALUES.map((v, i) => (
              <div
                key={i}
                className="bg-ink/6 rounded-2xl p-7 border border-ink/10 hover:bg-ink/10 transition-all duration-200 group cursor-default"
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-200 inline-block">
                  {v.icon}
                </div>
                <h3 className="font-display font-bold text-ink text-lg mb-1.5">{v.title}</h3>
                <p className="font-body text-ink/60 text-sm leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>

          {/* CTA inside value section */}
          <div className="mt-14 text-center">
            <button
              onClick={() => document.getElementById('hero-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 px-8 py-4 bg-ink text-offwhite font-display font-bold text-sm uppercase tracking-widest rounded-2xl hover:bg-ink/85 transition-all active:scale-95 shadow-lg shadow-ink/25"
            >
              ✦ Generate My Project Idea — Free
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="bg-ink px-6 py-12 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-1 mb-3">
            <span className="font-display font-black text-white text-lg">EngineerKit</span>
            <span className="font-display font-black text-purple text-lg">AI</span>
          </div>
          <p className="font-mono text-white/35 text-xs leading-relaxed">
            Built for Indian engineering students<br />
            AI by Llama 3.3 70B via NVIDIA NIM · Repos from GitHub
          </p>
          <div className="mt-8 pt-6 border-t border-white/8 font-mono text-white/20 text-[10px]">
            © 2025 EngineerKit AI · Free for all
          </div>
        </div>
      </footer>

    </div>
  )
}
