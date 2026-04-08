'use client'

import { useState } from 'react'
import { CheckCircle2, Circle, User, Users, Target, Clock } from 'lucide-react'
import { NextStep } from '@/lib/types'
import clsx from 'clsx'

const priorityConfig = {
  alta: { label: 'Alta', class: 'bg-red-100 text-red-700' },
  media: { label: 'Média', class: 'bg-amber-100 text-amber-700' },
  baixa: { label: 'Baixa', class: 'bg-gray-100 text-gray-600' },
}

const responsibleConfig = {
  vendedor: { label: 'Vendedor', icon: User },
  prospect: { label: 'Prospect', icon: Target },
  ambos: { label: 'Ambos', icon: Users },
}

interface Props {
  steps: NextStep[]
  callId: string
  editable?: boolean
}

export default function NextStepsList({ steps: initial, callId, editable = false }: Props) {
  const [steps, setSteps] = useState(initial)

  async function toggle(index: number) {
    if (!editable) return
    const updated = steps.map((s, i) => (i === index ? { ...s, completed: !s.completed } : s))
    setSteps(updated)
    await fetch(`/api/calls/${callId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nextSteps: updated }),
    })
  }

  if (steps.length === 0) {
    return <p className="text-gray-400 text-sm">Nenhum próximo passo identificado.</p>
  }

  return (
    <ul className="space-y-3">
      {steps.map((step, i) => {
        const priority = priorityConfig[step.priority]
        const responsible = responsibleConfig[step.responsible]
        const Icon = responsible.icon

        return (
          <li
            key={i}
            className={clsx(
              'flex gap-3 p-4 rounded-xl border transition-colors',
              step.completed
                ? 'bg-gray-50 border-gray-200 opacity-60'
                : 'bg-white border-gray-200 hover:border-indigo-200'
            )}
          >
            <button
              onClick={() => toggle(i)}
              disabled={!editable}
              className={clsx('mt-0.5 flex-shrink-0', editable && 'cursor-pointer hover:scale-110 transition-transform')}
            >
              {step.completed
                ? <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                : <Circle className="w-5 h-5 text-gray-300" />}
            </button>

            <div className="flex-1 min-w-0">
              <p className={clsx('text-sm font-medium text-gray-900', step.completed && 'line-through')}>{step.action}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${priority.class}`}>
                  {priority.label}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                  <Icon className="w-3 h-3" />
                  {responsible.label}
                </span>
                {step.dueDate && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    <Clock className="w-3 h-3" />
                    {step.dueDate}
                  </span>
                )}
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
