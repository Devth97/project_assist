'use client'

import { ProjectIdea } from '@/types'
import { difficultyColor } from '@/lib/utils'

interface IdeaCardProps {
  idea: ProjectIdea
}

export default function IdeaCard({ idea }: IdeaCardProps) {
  return (
    <div className="animate-slide-up w-full max-w-2xl mx-auto">
      {/* Free badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-accent3/10 border border-accent3/20 text-accent3">
          <span className="w-1.5 h-1.5 rounded-full bg-accent3 animate-pulse-slow" />
          Free
        </span>
        <span className="text-xs text-text3">Your AI-generated project idea</span>
      </div>

      <div className="bg-card border border-white/7 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/7 bg-gradient-to-r from-accent/5 to-transparent">
          <h2 className="font-syne font-bold text-xl text-white leading-tight mb-2">
            {idea.project_title}
          </h2>
          <p className="text-text2 text-sm leading-relaxed italic">
            {idea.tagline}
          </p>
        </div>

        <div className="p-6 space-y-5">
          {/* Problem statement */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-text3 mb-2">
              Problem Statement
            </p>
            <p className="text-text2 text-sm leading-relaxed">
              {idea.problem_statement}
            </p>
          </div>

          {/* Use cases */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-text3 mb-3">
              Use Cases
            </p>
            <ul className="space-y-2">
              {idea.use_cases.map((uc, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-text2">
                  <span className="mt-0.5 w-5 h-5 rounded-md bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0 text-accent text-xs font-bold font-mono">
                    {i + 1}
                  </span>
                  {uc}
                </li>
              ))}
            </ul>
          </div>

          {/* Brief explanation */}
          <div className="bg-bg3 rounded-xl p-4 border border-white/5">
            <p className="text-xs font-semibold uppercase tracking-widest text-text3 mb-2">
              How it works
            </p>
            <p className="text-text2 text-sm leading-relaxed">
              {idea.brief_explanation}
            </p>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${difficultyColor(idea.difficulty)}`}>
              {idea.difficulty}
            </span>
            <span className="text-xs text-text3 border border-white/10 bg-white/3 px-3 py-1.5 rounded-full">
              ~{idea.estimated_weeks} weeks
            </span>
          </div>

          {/* Tech stack */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-text3 mb-3">
              Recommended Tech Stack
            </p>
            <div className="flex flex-wrap gap-2">
              {idea.tech_stack.map((tech, i) => (
                <span
                  key={i}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20 text-accent/90"
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
