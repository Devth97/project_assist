'use client'

import { ProjectIdea } from '@/types'
import { difficultyColor } from '@/lib/utils'

interface IdeaCardProps {
  idea: ProjectIdea
}

export default function IdeaCard({ idea }: IdeaCardProps) {
  return (
    <div className="animate-slide-up w-full max-w-2xl mx-auto">

      {/* Badge row */}
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest px-3 py-1 rounded-md bg-emerald/8 border border-emerald/20 text-emerald">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse-slow" />
          Free · AI Generated
        </span>
        <span className="font-mono text-xs text-text3">your project idea</span>
      </div>

      <div className="bg-surface border border-amber/10 rounded-2xl overflow-hidden glow-card">

        {/* Amber top accent line */}
        <div className="h-0.5 bg-gradient-to-r from-amber via-amber/50 to-transparent" />

        {/* Header */}
        <div className="p-6 border-b border-white/5">
          <h2 className="font-display font-bold text-2xl text-text leading-tight mb-2">
            {idea.project_title}
          </h2>
          <p className="text-text2 text-sm font-body italic leading-relaxed">
            {idea.tagline}
          </p>
        </div>

        <div className="p-6 space-y-6">

          {/* Problem statement */}
          <div>
            <p className="font-mono text-[11px] text-amber/60 uppercase tracking-widest mb-2">
              Problem Statement
            </p>
            <p className="text-text2 text-sm leading-relaxed font-body">
              {idea.problem_statement}
            </p>
          </div>

          {/* Use cases */}
          <div>
            <p className="font-mono text-[11px] text-amber/60 uppercase tracking-widest mb-3">
              Use Cases
            </p>
            <ul className="space-y-2.5">
              {idea.use_cases.map((uc, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="font-mono text-amber text-xs mt-0.5 min-w-[22px] opacity-70">
                    0{i + 1}
                  </span>
                  <span className="text-text2 font-body leading-relaxed">{uc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* How it works */}
          <div className="bg-bg2 rounded-xl p-4 border border-white/5">
            <p className="font-mono text-[11px] text-amber/60 uppercase tracking-widest mb-2">
              How It Works
            </p>
            <p className="text-text2 text-sm leading-relaxed font-body">
              {idea.brief_explanation}
            </p>
          </div>

          {/* Meta + tech stack */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/5">
            <span className={`text-xs font-mono px-3 py-1 rounded-md border ${difficultyColor(idea.difficulty)}`}>
              {idea.difficulty}
            </span>
            <span className="text-xs font-mono px-3 py-1 rounded-md border border-white/8 text-text3">
              ~{idea.estimated_weeks}w
            </span>
          </div>

          <div>
            <p className="font-mono text-[11px] text-amber/60 uppercase tracking-widest mb-3">
              Recommended Tech Stack
            </p>
            <div className="flex flex-wrap gap-2">
              {idea.tech_stack.map((tech, i) => (
                <span
                  key={i}
                  className="text-xs font-mono px-3 py-1.5 rounded-md bg-amber/8 border border-amber/20 text-amber/90"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
