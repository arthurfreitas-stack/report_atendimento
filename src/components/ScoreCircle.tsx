'use client'

interface Props {
  score: number
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: { r: 24, stroke: 4, svg: 60, text: 'text-sm font-bold' },
  md: { r: 38, stroke: 6, svg: 90, text: 'text-xl font-bold' },
  lg: { r: 54, stroke: 8, svg: 128, text: 'text-3xl font-bold' },
}

export function scoreColor(score: number) {
  if (score >= 80) return { stroke: '#10b981', text: 'text-emerald-600', bg: 'bg-emerald-50', badge: 'bg-emerald-100 text-emerald-800' }
  if (score >= 60) return { stroke: '#f59e0b', text: 'text-amber-600', bg: 'bg-amber-50', badge: 'bg-amber-100 text-amber-800' }
  return { stroke: '#ef4444', text: 'text-red-600', bg: 'bg-red-50', badge: 'bg-red-100 text-red-800' }
}

export default function ScoreCircle({ score, size = 'md' }: Props) {
  const { r, stroke, svg, text } = sizeMap[size]
  const cx = svg / 2
  const circumference = 2 * Math.PI * r
  const offset = circumference - (score / 100) * circumference
  const colors = scoreColor(score)

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={svg} height={svg} className="-rotate-90">
        <circle cx={cx} cy={cx} r={r} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
        <circle
          cx={cx} cy={cx} r={r} fill="none"
          stroke={colors.stroke}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <span className={`absolute ${text} ${colors.text}`}>{score}</span>
    </div>
  )
}
