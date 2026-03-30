import OpenAI from 'openai'
import { ProjectIdea, Repo } from '@/types'

// NVIDIA NIM — using Llama 3.3 70B (fast, ~3-5s) via OpenAI-compatible API
// Kimi K2.5 is a 95-second reasoning model — too slow for serverless functions
let _client: OpenAI | null = null
function getClient() {
  if (!_client) {
    _client = new OpenAI({
      apiKey:  process.env.NVIDIA_API_KEY!,
      baseURL: 'https://integrate.api.nvidia.com/v1',
    })
  }
  return _client
}

const MODEL = 'meta/llama-3.3-70b-instruct'

// ── Idea Generator ─────────────────────────────────────────────────────────────
export async function generateIdea(
  branch: string,
  interest: string,
  year: string = '3rd Year'
): Promise<ProjectIdea> {
  const response = await getClient().chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content: `You are EngineerKit, an expert AI for Indian engineering students.
Generate ONE original, implementable project idea.

Requirements:
- Relevant to India's real problems (agriculture, healthcare, traffic, water, energy, education)
- Achievable in a 2-4 month college semester
- NOT a generic project (no calculators, todo lists, library management, basic chat apps)
- Aligned with the student's branch AND interest
- Specific enough that a student knows exactly what to build

RETURN ONLY valid JSON with no markdown fences, no extra text, no explanations:
{
  "project_title": "Descriptive title in max 10 words",
  "tagline": "One compelling sentence describing the impact",
  "problem_statement": "2-3 sentences describing a real Indian pain point with numbers/context",
  "use_cases": ["Specific use case 1", "Specific use case 2", "Specific use case 3"],
  "difficulty": "Beginner",
  "estimated_weeks": 8,
  "tech_stack": ["PrimaryTech", "SecondaryTech", "ThirdTech"],
  "brief_explanation": "2-3 plain-English sentences explaining how it works for a student"
}

difficulty must be exactly one of: Beginner, Intermediate, Advanced`,
      },
      {
        role: 'user',
        content: `Branch: ${branch}
Interest: ${interest}
Academic Year: ${year}
University context: Indian engineering (VTU / ANNA / Mumbai / JNTU / RGPV)

Generate a project using ${interest} as the primary technology that solves a visible problem in India. Return ONLY the JSON object.`,
      },
    ],
    temperature: 0.8,
    max_tokens: 1024,
  })

  const raw = response.choices[0].message.content || ''
  const cleaned = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()

  try {
    return JSON.parse(cleaned) as ProjectIdea
  } catch {
    console.error('[ai] Invalid JSON from model. Raw:', cleaned.slice(0, 300))
    throw new Error('AI returned an invalid response. Please try again.')
  }
}

// ── Repo Relevance Annotator ────────────────────────────────────────────────────
export async function annotateRepos(
  idea: ProjectIdea,
  repos: Repo[]
): Promise<Array<{ repo_url: string; relevance_note: string }>> {
  if (repos.length === 0) return []

  const repoList = repos
    .map(r => `- URL: ${r.url}\n  Name: ${r.name}\n  Description: ${r.description}\n  Language: ${r.language}\n  Stars: ${r.stars}`)
    .join('\n')

  const response = await getClient().chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content: `Given a project idea and GitHub repos, write a 1-2 sentence relevance note for each repo.

RETURN ONLY a JSON array, no markdown, no extra text:
[{"repo_url": "https://github.com/...", "relevance_note": "..."}]`,
      },
      {
        role: 'user',
        content: `Project: ${idea.project_title}
Tech Stack: ${idea.tech_stack.join(', ')}

Repos:
${repoList}

Return ONLY the JSON array.`,
      },
    ],
    temperature: 0.3,
    max_tokens: 1024,
  })

  const raw = response.choices[0].message.content || '[]'
  const cleaned = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()

  try {
    return JSON.parse(cleaned)
  } catch {
    console.error('[ai] Invalid JSON from annotateRepos:', cleaned.slice(0, 200))
    return []
  }
}
