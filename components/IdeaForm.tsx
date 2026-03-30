'use client'

import { useState, FormEvent } from 'react'
import { cn } from '@/lib/utils'

const BRANCHES = [
  'Computer Science Engineering (CSE)',
  'Information Science Engineering (ISE)',
  'Artificial Intelligence & Machine Learning (AIML)',
  'Data Science (DS)',
  'Electronics & Communication Engineering (ECE)',
  'Electrical & Electronics Engineering (EEE)',
  'Mechanical Engineering (ME)',
  'Civil Engineering (CE)',
  'Chemical Engineering (ChE)',
  'Biotechnology (BT)',
  'Aerospace Engineering',
  'Industrial Engineering',
]

const INTERESTS: Record<string, string[]> = {
  default: [
    'Machine Learning / AI',
    'Internet of Things (IoT)',
    'Web Development',
    'Mobile App Development',
    'Computer Vision',
    'Natural Language Processing',
    'Blockchain',
    'Cybersecurity',
    'Cloud Computing',
    'AR / VR',
    'Robotics & Automation',
    'Data Analytics',
    'Embedded Systems',
    'Deep Learning',
    'Edge Computing',
  ],
}

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year']

interface IdeaFormProps {
  onSubmit: (branch: string, interest: string, year: string) => void
  isLoading?: boolean
}

export default function IdeaForm({ onSubmit, isLoading }: IdeaFormProps) {
  const [branch,   setBranch]   = useState('')
  const [interest, setInterest] = useState('')
  const [year,     setYear]     = useState('3rd Year')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!branch || !interest) return
    onSubmit(branch, interest, year)
  }

  const selectCls = cn(
    'w-full bg-card2 border border-white/10 rounded-xl px-4 py-3',
    'text-text text-sm appearance-none cursor-pointer',
    'focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30',
    'transition-colors hover:border-white/20',
  )

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto space-y-5"
    >
      {/* Branch */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-widest text-text3">
          Engineering Branch
        </label>
        <div className="relative">
          <select
            value={branch}
            onChange={e => setBranch(e.target.value)}
            required
            className={selectCls}
          >
            <option value="" disabled>Select your branch…</option>
            {BRANCHES.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text3 text-xs">▼</span>
        </div>
      </div>

      {/* Interest */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-widest text-text3">
          Area of Interest / Primary Technology
        </label>
        <div className="relative">
          <select
            value={interest}
            onChange={e => setInterest(e.target.value)}
            required
            className={selectCls}
          >
            <option value="" disabled>Select your interest…</option>
            {INTERESTS.default.map(i => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text3 text-xs">▼</span>
        </div>
      </div>

      {/* Year */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-widest text-text3">
          Academic Year
        </label>
        <div className="flex gap-3">
          {YEARS.map(y => (
            <button
              key={y}
              type="button"
              onClick={() => setYear(y)}
              className={cn(
                'flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all',
                year === y
                  ? 'bg-accent/20 border-accent/50 text-accent'
                  : 'bg-card2 border-white/10 text-text3 hover:border-white/20 hover:text-text2',
              )}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!branch || !interest || isLoading}
        className={cn(
          'w-full py-4 rounded-xl font-syne font-bold text-base tracking-wide transition-all',
          'bg-accent hover:bg-accent/90 text-white',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          'shadow-lg shadow-accent/20 hover:shadow-accent/30',
          'active:scale-[0.99]',
        )}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Generating your idea…
          </span>
        ) : (
          '✦ Generate My Project Idea'
        )}
      </button>
    </form>
  )
}
