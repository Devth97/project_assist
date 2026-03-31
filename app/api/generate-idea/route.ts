import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { generateIdea } from '@/lib/kimi'
import { findRepos } from '@/lib/github'

// Required for Next.js App Router — vercel.json maxDuration is ignored for API routes
export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { branch, interest, year } = body as {
      branch: string
      interest: string
      year?: string
    }

    if (!branch?.trim() || !interest?.trim()) {
      return NextResponse.json(
        { error: 'Branch and interest are required' },
        { status: 400 }
      )
    }

    // 1. Generate project idea via Kimi K2.5 on NVIDIA NIM
    const idea = await generateIdea(branch, interest, year ?? '3rd Year')

    // 2. Search GitHub + annotate with Kimi (with 24h caching)
    const repos = await findRepos(idea)

    // 3. Persist to Supabase — repos_json is stored but NEVER returned here
    const { data, error: dbError } = await supabaseAdmin
      .from('sessions')
      .insert({
        branch,
        interest,
        idea_json:  idea,
        repos_json: repos,   // server-only; hidden from client until paid
        repos_paid: false,
        kit_paid:   false,
      })
      .select('id')
      .single()

    if (dbError) {
      console.error('Supabase insert error:', dbError)
      throw new Error('Failed to save session')
    }

    // Return ONLY the idea and session_id — never repos_json
    return NextResponse.json({
      idea,
      session_id: data.id,
    })
  } catch (err) {
    console.error('[generate-idea]', err)
    const message = err instanceof Error ? err.message : 'Failed to generate idea'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
