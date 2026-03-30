export interface ProjectIdea {
  project_title: string
  tagline: string
  problem_statement: string
  use_cases: string[]
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  estimated_weeks: number
  tech_stack: string[]
  brief_explanation: string
}

export interface Repo {
  name: string
  url: string
  description: string
  stars: number
  forks: number
  language: string
  updated: string
  relevance_note?: string
  score?: number
}

export interface Session {
  id: string
  user_id?: string
  branch: string
  interest: string
  idea_json: ProjectIdea
  repos_json?: Repo[]
  repos_paid: boolean
  kit_paid: boolean
  kit_url?: string
  created_at: string
}

export interface GenerateIdeaResponse {
  idea: ProjectIdea
  session_id: string
  error?: string
}

export interface CreateOrderResponse {
  order_id: string
  amount: number
  key_id: string
  error?: string
}

export interface VerifyPaymentResponse {
  repos?: Repo[]
  error?: string
}

export type AppState = 'idle' | 'generating' | 'idea_ready' | 'paying' | 'repos_revealed'

export type PaymentTier = 'repos' | 'kit'
