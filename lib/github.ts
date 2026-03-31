import { ProjectIdea, Repo } from '@/types'
import { supabaseAdmin } from './supabase'
import { sha256 } from './utils'

// ── Main entry point ────────────────────────────────────────────────────────────
// Note: AI annotation removed — two sequential NVIDIA NIM calls in one
// serverless function caused consistent timeouts on Vercel Hobby (60s limit).
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

  // 2. GitHub Search API
  let repos = await searchGitHub(idea)

  // 3. Fallback if fewer than 3 results
  if (repos.length < 3 && process.env.FIRECRAWL_API_KEY) {
    const extras = await scrapeViaFirecrawl(idea.project_title, idea.tech_stack[0])
    repos = [...repos, ...extras]
  }

  // 4. Score and rank by stars + tech match + recency
  const scored = repos
    .map(r => ({
      ...r,
      score:
        r.stars / 100 +
        (idea.tech_stack.some(t =>
          `${r.description} ${r.name}`.toLowerCase().includes(t.toLowerCase())
        ) ? 5 : 0) +
        (new Date(r.updated).getFullYear() >= 2023 ? 3 : 0),
    }))
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, 5)

  // 5. Cache results
  await supabaseAdmin.from('scrape_cache').upsert({
    query_hash: cacheKey,
    repos_json: scored,
    cached_at:  new Date().toISOString(),
  })

  return scored
}

// ── GitHub Search API ───────────────────────────────────────────────────────────
async function searchGitHub(idea: ProjectIdea): Promise<Repo[]> {
  // Use only tech stack terms — project titles are AI-generated names (e.g. "PhishGuard")
  // that don't exist on GitHub, which makes combined queries return 0 results.
  const techTerms = idea.tech_stack.slice(0, 2).join(' ')

  const trySearch = async (q: string): Promise<GHRepo[]> => {
    const res = await fetch(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=10`,
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          Accept:        'application/vnd.github.v3+json',
        },
        next: { revalidate: 0 },
      }
    )
    if (!res.ok) return []
    const data = await res.json()
    return (data.items ?? []).filter((r: GHRepo) => r.stargazers_count > 10)
  }

  // 1st attempt: tech terms only (broad, reliable)
  let items = await trySearch(techTerms)

  // 2nd attempt: if too few results, fall back to just the primary tech
  if (items.length < 3) {
    items = await trySearch(idea.tech_stack[0])
  }

  return items
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
