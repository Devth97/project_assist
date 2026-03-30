'use client'

import { Repo } from '@/types'
import { formatStars, languageColor } from '@/lib/utils'

interface RepoCardProps {
  repo: Repo
  index: number
}

export default function RepoCard({ repo, index }: RepoCardProps) {
  const repoName = repo.name.includes('/') ? repo.name : repo.name

  return (
    <div
      className="animate-slide-up bg-card2 border border-white/7 rounded-xl p-5 hover:border-accent/25 transition-all group"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'backwards' }}
    >
      {/* Name + link */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <a
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-sm font-semibold text-accent hover:text-accent/80 transition-colors leading-tight break-all"
        >
          {repoName}
        </a>
        <a
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-text3 hover:text-text hover:border-white/20 transition-all"
          aria-label="Open on GitHub"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      </div>

      {/* Description */}
      <p className="text-text2 text-sm leading-relaxed mb-4">
        {repo.description}
      </p>

      {/* Relevance note */}
      {repo.relevance_note && (
        <div className="bg-accent/5 border border-accent/15 rounded-lg px-4 py-3 mb-4">
          <p className="text-xs font-semibold text-accent/70 uppercase tracking-wider mb-1">
            AI Relevance Note
          </p>
          <p className="text-text2 text-sm leading-relaxed">
            {repo.relevance_note}
          </p>
        </div>
      )}

      {/* Meta */}
      <div className="flex items-center flex-wrap gap-4 text-xs text-text3">
        {repo.stars > 0 && (
          <span className="flex items-center gap-1">
            <span className="text-accent4">⭐</span>
            {formatStars(repo.stars)}
          </span>
        )}
        {repo.forks > 0 && (
          <span className="flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="6" y1="3" x2="6" y2="15" />
              <circle cx="18" cy="6" r="3" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="6" cy="6" r="3" />
              <path d="M18 9a9 9 0 01-9 9" />
            </svg>
            {formatStars(repo.forks)}
          </span>
        )}
        {repo.language && repo.language !== 'Unknown' && (
          <span className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: languageColor(repo.language) }}
            />
            {repo.language}
          </span>
        )}
        {repo.updated && (
          <span>
            Updated {new Date(repo.updated).getFullYear()}
          </span>
        )}
      </div>
    </div>
  )
}
