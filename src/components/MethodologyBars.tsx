'use client'

import { Methodology } from '@/lib/types'

const labels: Record<keyof Methodology, string> = {
  rapport: 'Rapport & Conexão',
  discovery: 'Descoberta (Discovery)',
  presentation: 'Apresentação de Valor',
  objectionHandling: 'Tratamento de Objeções',
  closing: 'Fechamento',
}

function barColor(value: number) {
  if (value >= 8) return 'bg-emerald-500'
  if (value >= 6) return 'bg-amber-400'
  return 'bg-red-400'
}

interface Props {
  methodology: Methodology
}

export default function MethodologyBars({ methodology }: Props) {
  return (
    <div className="space-y-4">
      {(Object.keys(labels) as (keyof Methodology)[]).map(key => {
        const value = methodology[key]
        return (
          <div key={key}>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-700">{labels[key]}</span>
              <span className="text-sm font-semibold text-gray-900">{value}/10</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${barColor(value)} transition-all duration-500`}
                style={{ width: `${value * 10}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
