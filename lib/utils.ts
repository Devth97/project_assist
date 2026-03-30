import { createHash } from 'crypto'

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function sha256(input: string): string {
  return createHash('sha256').update(input).digest('hex')
}

export function formatStars(stars: number): string {
  if (stars >= 1000) return `${(stars / 1000).toFixed(1)}k`
  return stars.toString()
}

export function difficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'Beginner':     return 'text-accent3 bg-accent3/10 border-accent3/20'
    case 'Intermediate': return 'text-accent4 bg-accent4/10 border-accent4/20'
    case 'Advanced':     return 'text-accent2 bg-accent2/10 border-accent2/20'
    default:             return 'text-text2 bg-white/5 border-white/10'
  }
}

export function languageColor(lang: string): string {
  const colors: Record<string, string> = {
    Python:     '#3572A5',
    JavaScript: '#f1e05a',
    TypeScript: '#2b7489',
    'C++':      '#f34b7d',
    C:          '#555555',
    Java:       '#b07219',
    Rust:       '#dea584',
    Go:         '#00ADD8',
    Kotlin:     '#F18E33',
    Swift:      '#ffac45',
    Dart:       '#00B4AB',
    HTML:       '#e34c26',
    CSS:        '#563d7c',
    Ruby:       '#701516',
    PHP:        '#4F5D95',
    'C#':       '#178600',
    Shell:      '#89e051',
    Arduino:    '#BD79D1',
    MicroPython:'#2B5B84',
  }
  return colors[lang] || '#8b949e'
}
