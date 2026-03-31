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
    'w-full bg-surface border rounded-xl px-4 py-3.5',
    'text-text font-body text-sm appearance-none cursor-pointer',
    'focus:outline-none focus:border-amber/40 focus:ring-1 focus:ring-amber/15',
    'hover:border-amber/20 transition-colors',
    'border-amber/10',
  )

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-6">

      {/* Section title */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-6 h-px bg-amber" />
        <span className="font-mono text-amber text-sm uppercase tracking-widest">Configure Your Idea</span>
      </div>

      {/* Branch */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-amber font-mono text-sm select-none">›</span>
          <label className="font-mono text-xs uppercase tracking-widest text-text3">
            Engineering Branch
          </label>
        </div>
        <div className="relative">
          <select value={branch} onChange={e => setBranch(e.target.value)} required className={selectCls}>
            <option value="" disabled>Select your branch...</option>
            {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-amber/40 text-xs">▼</span>
        </div>
      </div>

      {/* Interest */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-amber font-mono text-sm select-none">›</span>
          <label className="font-mono text-xs uppercase tracking-widest text-text3">
            Area of Interest / Primary Technology
          </label>
        </div>
        <div className="relative">
          <select value={interest} onChange={e => setInterest(e.target.value)} required className={selectCls}>
            <option value="" disabled>Select your interest...</option>
            {INTERESTS.default.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-amber/40 text-xs">▼</span>
        </div>
      </div>

      {/* Year */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-amber font-mono text-sm select-none">›</span>
          <label className="font-mono text-xs uppercase tracking-widest text-text3">
            Academic Year
          </label>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {YEARS.map(y => (
            <button
              key={y}
              type="button"
              onClick={() => setYear(y)}
              className={cn(
                'py-2.5 rounded-xl text-xs font-mono border transition-all',
                year === y
                  ? 'bg-amber text-bg border-amber font-bold shadow-lg shadow-amber/20'
                  : 'bg-transparent border-white/8 text-text3 hover:border-amber/20 hover:text-text2',
              )}
            >
              {y.replace(' Year', 'Y')}
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!branch || !interest || isLoading}
        className={cn(
          'w-full py-4 rounded-xl font-display font-bold text-sm uppercase tracking-widest transition-all mt-2',
          'bg-amber text-bg hover:bg-amber/90',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          'shadow-lg shadow-amber/20 hover:shadow-amber/35',
          'active:scale-[0.99]',
        )}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-bg/30 border-t-bg rounded-full animate-spin" />
            Generating...
          </span>
        ) : (
          '✦ Generate My Project Idea'
        )}
      </button>
    </form>
  )
}
