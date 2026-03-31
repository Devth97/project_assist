'use client'

import { Repo } from '@/types'
import { formatStars, languageColor } from '@/lib/utils'

interface RepoCardProps {
  repo: Repo
  index: number
}

export default function RepoCard({ repo, index }: RepoCardProps) {
  return (
    <div
      className="animate-slide-up bg-surface border border-white/6 rounded-xl p-5 hover:border-amber/25 hover:bg-surface2 transition-all group"
      style={{ animationDelay: `${index * 70}ms`, animationFillMode: 'backwards' }}
    >
      {/* Name + open link */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <a
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-sm font-medium text-amber hover:text-amber/75 transition-colors break-all leading-tight"
        >
          {repo.name}
        </a>
        <a
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 w-7 h-7 rounded-lg bg-white/4 border border-white/8 flex items-center justify-center text-text3 hover:text-amber hover:border-amber/20 transition-all text-xs"
          aria-label="Open on GitHub"
        >
          ↗
        </a>
      </div>

      {/* Description */}
      <p className="text-text2 text-sm leading-relaxed mb-4 font-body">
        {repo.description}
      </p>

      {/* Relevance note */}
      {repo.relevance_note && (
        <div className="bg-amber/4 border border-amber/12 rounded-lg px-4 py-3 mb-4">
          <p className="font-mono text-[10px] text-amber/50 uppercase tracking-widest mb-1">AI Note</p>
          <p className="text-text2 text-xs leading-relaxed font-body">{repo.relevance_note}</p>
        </div>
      )}

      {/* Meta stats */}
      <div className="flex items-center flex-wrap gap-4 text-xs text-text3 font-mono">
        {repo.stars > 0 && (
          <span className="text-amber/60">⭐ {formatStars(repo.stars)}</span>
        )}
        {repo.forks > 0 && (
          <span>⌥ {formatStars(repo.forks)}</span>
        )}
        {repo.language && repo.language !== 'Unknown' && (
          <span className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: languageColor(repo.language) }}
            />
            {repo.language}
          </span>
        )}
        {repo.updated && (
          <span>{new Date(repo.updated).getFullYear()}</span>
        )}
      </div>
    </div>
  )
}
