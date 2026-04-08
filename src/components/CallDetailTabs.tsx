'use client'

import { useState } from 'react'
import { TrendingUp, ListChecks, Layers, FileText, ThumbsUp, AlertCircle } from 'lucide-react'
import { CallAnalysis } from '@/lib/types'
import MethodologyBars from './MethodologyBars'
import NextStepsList from './NextStepsList'
import HubspotPanel from './HubspotPanel'
import clsx from 'clsx'

type Tab = 'analise' | 'passos' | 'hubspot' | 'transcricao'

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'analise', label: 'Análise', icon: TrendingUp },
  { id: 'passos', label: 'Próximos Passos', icon: ListChecks },
  { id: 'hubspot', label: 'HubSpot', icon: Layers },
  { id: 'transcricao', label: 'Transcrição', icon: FileText },
]

interface Props {
  call: CallAnalysis
}

export default function CallDetailTabs({ call }: Props) {
  const [active, setActive] = useState<Tab>('analise')
  const pendingSteps = call.nextSteps.filter(s => !s.completed).length

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-6 overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon
          const isActive = active === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={clsx(
                'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex-1 justify-center',
                isActive
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {tab.id === 'passos' && pendingSteps > 0 && (
                <span className="ml-1 bg-indigo-100 text-indigo-700 text-xs font-semibold px-1.5 py-0.5 rounded-full">
                  {pendingSteps}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      {active === 'analise' && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Resumo Executivo</h3>
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{call.summary}</p>
          </div>

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <ThumbsUp className="w-4 h-4 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Pontos Fortes</h3>
              </div>
              {call.strengths.length === 0
                ? <p className="text-sm text-gray-400">Nenhum ponto identificado.</p>
                : (
                  <ul className="space-y-2">
                    {call.strengths.map((s, i) => (
                      <li key={i} className="flex gap-2 text-sm text-gray-700">
                        <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Pontos de Melhoria</h3>
              </div>
              {call.improvements.length === 0
                ? <p className="text-sm text-gray-400">Nenhum ponto identificado.</p>
                : (
                  <ul className="space-y-2">
                    {call.improvements.map((s, i) => (
                      <li key={i} className="flex gap-2 text-sm text-gray-700">
                        <span className="text-amber-500 mt-0.5 flex-shrink-0">→</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
            </div>
          </div>

          {/* Methodology */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-5">Metodologia de Vendas</h3>
            <MethodologyBars methodology={call.methodology} />
          </div>
        </div>
      )}

      {active === 'passos' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-gray-900">Próximos Passos</h3>
            <span className="text-sm text-gray-400">
              {call.nextSteps.filter(s => s.completed).length}/{call.nextSteps.length} concluídos
            </span>
          </div>
          <NextStepsList steps={call.nextSteps} callId={call.id} editable />
        </div>
      )}

      {active === 'hubspot' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-5">Dados do HubSpot</h3>
          <HubspotPanel call={call} />
        </div>
      )}

      {active === 'transcricao' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Transcrição da Call</h3>
          {call.transcriptUrl ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center">
                <FileText className="w-7 h-7 text-indigo-400" />
              </div>
              <p className="text-sm text-gray-500 text-center max-w-sm">
                A transcrição completa está salva no Google Drive. Clique abaixo para abrir.
              </p>
              <a
                href={call.transcriptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors"
              >
                <FileText className="w-4 h-4" />
                Abrir transcrição no Google Drive
              </a>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Link da transcrição não disponível.</p>
          )}
        </div>
      )}
    </div>
  )
}
