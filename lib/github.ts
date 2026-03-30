import { ProjectIdea, Repo } from '@/types'
import { supabaseAdmin } from './supabase'
import { sha256 } from './utils'
import { annotateRepos } from './kimi'

// ── Main entry point ────────────────────────────────────────────────────────────
export async function findRepos(idea: ProjectIdea): Promise<Repo[]> {
  const cacheKey = sha256(`${idea.project_title}-${idea.tech_stack[0]}-${idea.tech_stack[1] || ''}`)

  // 1. Check 24-hour cache in Supabase
  const { data: cached } = await supabaseAdmin
    .from('scrape_cache')
    .select('repos_json, cached_at')
    .eq('query_hash', cacheKey)
    .single()

  if (cached?.repos_json) {
    const age = (Date.now() - new Date(cached.cached_at).getTime()) / 3_600_000
    if (age < 24) return cached.repos_json as Repo[]
  }

  // 2. Primary: GitHub Search API (structured, 5k req/hr with token)
  let repos = await searchGitHub(idea)

  // 3. Fallback: Firecrawl when GitHub returns fewer than 3 results
  if (repos.length < 3 && process.env.FIRECRAWL_API_KEY) {
    const extras = await scrapeViaFirecrawl(idea.interest, idea.tech_stack[0])
    repos = [...repos, ...extras]
  }

  // 4. Score: stars + tech match + recency
  const scored = repos
    .map(r => ({
      ...r,
      score:
        r.stars / 100 +
        (idea.tech_stack.some(t =>
          `${r.description} ${r.name}`.toLowerCase().includes(t.toLowerCase())
        )
          ? 5
          : 0) +
        (new Date(r.updated).getFullYear() >= 2023 ? 3 : 0),
    }))
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, 5)

  // 5. Annotate with Kimi relevance notes
  const annotations = await annotateRepos(idea, scored)
  const annotated = scored.map(repo => ({
    ...repo,
    relevance_note:
      annotations.find(a => a.repo_url === repo.url)?.relevance_note ?? '',
  }))

  // 6. Cache results
  await supabaseAdmin.from('scrape_cache').upsert({
    query_hash:  cacheKey,
    repos_json:  annotated,
    cached_at:   new Date().toISOString(),
  })

  return annotated
}

// ── GitHub Search API ───────────────────────────────────────────────────────────
async function searchGitHub(idea: ProjectIdea): Promise<Repo[]> {
  const techTerms  = idea.tech_stack.slice(0, 2).join(' ')
  const titleTerms = idea.project_title.split(' ').slice(0, 4).join(' ')
  const q          = encodeURIComponent(`${techTerms} ${titleTerms}`)

  const res = await fetch(
    `https://api.github.com/search/repositories?q=${q}&sort=stars&order=desc&per_page=10`,
    {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        Accept:        'application/vnd.github.v3+json',
      },
      next: { revalidate: 0 }, // no Next.js cache — always fresh
    }
  )

  if (!res.ok) return []

  const data = await res.json()
  return (data.items ?? [])
    .filter((r: GHRepo) => r.stargazers_count > 50)
    .slice(0, 8)
    .map((r: GHRepo): Repo => ({
      name:        r.full_name,
      url:         r.html_url,
      description: r.description ?? 'No description available',
      stars:       r.stargazers_count,
      forks:       r.forks_count,
      language:    r.language ?? 'Unknown',
      updated:     r.updated_at,
    }))
}

// ── Firecrawl fallback ──────────────────────────────────────────────────────────
async function scrapeViaFirecrawl(interest: string, tech: string): Promise<Repo[]> {
  try {
    const searchUrl = `https://github.com/search?q=${encodeURIComponent(`${interest} ${tech}`)}&type=repositories&sort=stars`

    const res = await fetch('https://api.firecrawl.dev/v0/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization:  `Bearer ${process.env.FIRECRAWL_API_KEY}`,
      },
      body: JSON.stringify({
        url:         searchUrl,
        pageOptions: { onlyMainContent: true },
      }),
    })

    if (!res.ok) return []

    const data    = await res.json()
    const content = (data.data?.content as string) ?? ''

    // Extract github.com/owner/repo paths
    const matches = [...new Set(content.match(/github\.com\/[\w-]+\/[\w.-]+/g) ?? [])]

    return matches.slice(0, 5).map(
      (path): Repo => ({
        name:        path.replace('github.com/', ''),
        url:         `https://${path}`,
        description: `Found via Firecrawl search for ${interest} ${tech}`,
        stars:       0,
        forks:       0,
        language:    tech,
        updated:     new Date().toISOString(),
      })
    )
  } catch {
    return []
  }
}

// ── GitHub API shape ────────────────────────────────────────────────────────────
interface GHRepo {
  full_name:        string
  html_url:         string
  description:      string | null
  stargazers_count: number
  forks_count:      number
  language:         string | null
  updated_at:       string
}
