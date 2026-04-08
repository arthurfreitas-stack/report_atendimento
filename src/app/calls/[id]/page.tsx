import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Building2, Calendar, Clock, User } from 'lucide-react'
import { getCall } from '@/lib/store'
import ScoreCircle, { scoreColor } from '@/components/ScoreCircle'
import CallDetailTabs from '@/components/CallDetailTabs'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const dynamic = 'force-dynamic'

interface Props {
  params: { id: string }
}

export default async function CallDetailPage({ params }: Props) {
  const call = await getCall(params.id)
  if (!call) notFound()

  const colors = scoreColor(call.score)
  const scoreLabel = call.score >= 80 ? 'Excelente' : call.score >= 60 ? 'Em desenvolvimento' : 'Precisa atenção'

  return (
    <div>
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Voltar ao dashboard
      </Link>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900">{call.prospectName}</h1>
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4" />{call.company}</span>
              <span className="flex items-center gap-1.5"><User className="w-4 h-4" />{call.vendorName}</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{format(new Date(call.callDate), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{call.duration} minutos</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-400 mb-0.5">Score da Call</p>
              <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-semibold ${colors.badge}`}>{scoreLabel}</span>
            </div>
            <ScoreCircle score={call.score} size="lg" />
          </div>
        </div>
      </div>

      <CallDetailTabs call={call} />
    </div>
  )
}
