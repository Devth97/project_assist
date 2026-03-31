import { ProjectIdea } from '@/types'

const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions'
const MODEL = 'meta/llama-3.3-70b-instruct'

// Direct fetch instead of OpenAI SDK — Next.js patches the global fetch with
// caching logic that breaks streaming/long-lived connections on Vercel.
async function nimFetch(messages: { role: string; content: string }[], maxTokens = 1024): Promise<string> {
  const res = await fetch(NVIDIA_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.8,
      max_tokens: maxTokens,
      stream: false,
    }),
    // Bypass Next.js fetch cache — required for Vercel serverless
    cache: 'no-store',
  })

  if (!res.ok) {
    const text = await res.text()
    console.error('[nim] Error response:', res.status, text.slice(0, 200))
    throw new Error(`NVIDIA NIM returned ${res.status}`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content ?? ''
}

function parseJSON(raw: string): unknown {
  const cleaned = raw
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/^```json\s*/im, '')
    .replace(/^```\s*/im, '')
    .replace(/\s*```$/im, '')
    .trim()
  return JSON.parse(cleaned)
}

// ── Idea Generator ──────────────────────────────────────────────────────────────
export async function generateIdea(
  branch: string,
  interest: string,
  year = '3rd Year'
): Promise<ProjectIdea> {
  const raw = await nimFetch([
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
  ], 1024)

  try {
    return parseJSON(raw) as ProjectIdea
  } catch {
    console.error('[ai] Invalid JSON from model. Raw:', raw.slice(0, 300))
    throw new Error('AI returned an invalid response. Please try again.')
  }
}
