import Link from 'next/link'
import { Building2, Calendar, Clock, CheckCircle2 } from 'lucide-react'
import { CallAnalysis } from '@/lib/types'
import ScoreCircle, { scoreColor } from './ScoreCircle'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Props {
  call: CallAnalysis
}

export default function CallCard({ call }: Props) {
  const colors = scoreColor(call.score)
  const pending = call.nextSteps.filter(s => !s.completed).length

  return (
    <Link
      href={`/calls/${call.id}`}
      className="block bg-white rounded-2xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200 overflow-hidden"
    >
      {/* Score bar */}
      <div className={`h-1.5 w-full ${colors.bg} ${call.score >= 80 ? 'bg-emerald-400' : call.score >= 60 ? 'bg-amber-400' : 'bg-red-400'}`} />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate">{call.prospectName}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Building2 className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <p className="text-sm text-gray-500 truncate">{call.company}</p>
            </div>
          </div>
          <ScoreCircle score={call.score} size="sm" />
        </div>

        <p className="mt-3 text-xs text-gray-600 line-clamp-2 leading-relaxed">{call.summary}</p>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {format(new Date(call.callDate), "d MMM yyyy", { locale: ptBR })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {call.duration}min
            </span>
          </div>

          <div className="flex items-center gap-2">
            {call.hubspotSynced && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
                <CheckCircle2 className="w-3 h-3" />
                HubSpot
              </span>
            )}
            {pending > 0 && (
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                {pending} passo{pending > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        <p className="mt-3 text-xs text-gray-400">Vendedor: <span className="font-medium text-gray-600">{call.vendorName}</span></p>
      </div>
    </Link>
  )
}
