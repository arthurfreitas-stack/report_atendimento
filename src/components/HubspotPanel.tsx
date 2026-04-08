'use client'

import { useState } from 'react'
import { CheckCircle2, AlertCircle, ExternalLink, RefreshCw } from 'lucide-react'
import { CallAnalysis } from '@/lib/types'

const dealStageLabels: Record<string, string> = {
  prospecting: 'Prospecção',
  appointment_scheduled: 'Reunião Agendada',
  qualified_to_buy: 'Qualificado para Compra',
  presentation_scheduled: 'Apresentação Agendada',
  decision_maker_bought_in: 'Decisor Engajado',
  contract_sent: 'Contrato Enviado',
  closed_won: 'Ganho',
  closed_lost: 'Perdido',
}

const activityTypeLabels: Record<string, string> = {
  call: 'Ligação',
  email: 'E-mail',
  meeting: 'Reunião',
  task: 'Tarefa',
}

interface Props {
  call: CallAnalysis
}

export default function HubspotPanel({ call }: Props) {
  const [syncing, setSyncing] = useState(false)
  const [synced, setSynced] = useState(call.hubspotSynced)
  const [error, setError] = useState<string | null>(null)

  const { hubspotFields: hf, hubspotDealId } = call

  async function markSynced() {
    setSyncing(true)
    setError(null)
    try {
      const res = await fetch(`/api/calls/${call.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hubspotSynced: true, status: 'synced' }),
      })
      if (!res.ok) throw new Error('Erro ao atualizar')
      setSynced(true)
    } catch {
      setError('Falha ao marcar como sincronizado.')
    } finally {
      setSyncing(false)
    }
  }

  const fields = [
    { label: 'Estágio do Negócio', value: hf.dealStage ? (dealStageLabels[hf.dealStage] ?? hf.dealStage) : null },
    { label: 'Valor Estimado', value: hf.amount ? `R$ ${hf.amount.toLocaleString('pt-BR')}` : null },
    { label: 'Previsão de Fechamento', value: hf.closeDate ? new Date(hf.closeDate).toLocaleDateString('pt-BR') : null },
    { label: 'Próxima Atividade', value: hf.nextActivityDate ? new Date(hf.nextActivityDate).toLocaleDateString('pt-BR') : null },
    { label: 'Tipo de Atividade', value: hf.nextActivityType ? (activityTypeLabels[hf.nextActivityType] ?? hf.nextActivityType) : null },
    { label: 'Status do Lead', value: hf.leadStatus ?? null },
  ]

  return (
    <div className="space-y-6">
      {/* Sync status */}
      <div className={`flex items-center justify-between p-4 rounded-xl border ${synced ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
        <div className="flex items-center gap-2">
          {synced
            ? <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            : <AlertCircle className="w-5 h-5 text-amber-600" />}
          <span className={`text-sm font-medium ${synced ? 'text-emerald-800' : 'text-amber-800'}`}>
            {synced ? 'Sincronizado com HubSpot' : 'Aguardando sincronização com HubSpot'}
          </span>
        </div>
        {!synced && (
          <button
            onClick={markSynced}
            disabled={syncing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            Marcar como sincronizado
          </button>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Deal link */}
      {hubspotDealId && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Deal ID: <span className="font-mono font-medium text-gray-900">{hubspotDealId}</span></span>
          <a
            href={`https://app.hubspot.com/contacts/deals/${hubspotDealId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800"
          >
            Abrir no HubSpot <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Fields grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map(f => (
          <div key={f.label} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-xs text-gray-500 mb-0.5">{f.label}</p>
            <p className="text-sm font-medium text-gray-900">{f.value ?? <span className="text-gray-400">—</span>}</p>
          </div>
        ))}
      </div>

      {/* Notes */}
      {hf.notes && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Notas para o CRM</p>
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
            {hf.notes}
          </div>
        </div>
      )}
    </div>
  )
}
