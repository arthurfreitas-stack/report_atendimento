import { getAllCalls, getStats } from '@/lib/store'
import CallCard from '@/components/CallCard'
import DashboardFilters from '@/components/DashboardFilters'
import { BarChart3, CheckCircle2, TrendingUp, ListChecks } from 'lucide-react'

export const dynamic = 'force-dynamic'

function StatCard({ label, value, sub, icon: Icon, color }: {
  label: string
  value: string | number
  sub?: string
  icon: React.ElementType
  color: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const stats = getStats()
  const calls = getAllCalls()

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard de Atendimentos</h1>
        <p className="text-gray-500 mt-1">Análise de performance das calls da equipe de vendas</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Calls Analisadas"
          value={stats.total}
          icon={BarChart3}
          color="bg-indigo-50 text-indigo-600"
        />
        <StatCard
          label="Score Médio"
          value={`${stats.avgScore}/100`}
          sub={`${stats.scoreDistribution.high} excelentes`}
          icon={TrendingUp}
          color="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          label="Próximos Passos"
          value={stats.pendingNextSteps}
          sub="pendentes"
          icon={ListChecks}
          color="bg-amber-50 text-amber-600"
        />
        <StatCard
          label="HubSpot Sync"
          value={stats.hubspotSynced}
          sub={`de ${stats.total} calls`}
          icon={CheckCircle2}
          color="bg-sky-50 text-sky-600"
        />
      </div>

      {/* Score distribution */}
      {stats.total > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-8">
          <p className="text-sm font-medium text-gray-700 mb-3">Distribuição de Scores</p>
          <div className="flex gap-2 h-3 rounded-full overflow-hidden">
            {stats.scoreDistribution.high > 0 && (
              <div
                className="bg-emerald-400 rounded-full"
                style={{ width: `${(stats.scoreDistribution.high / stats.total) * 100}%` }}
                title={`${stats.scoreDistribution.high} excelentes`}
              />
            )}
            {stats.scoreDistribution.medium > 0 && (
              <div
                className="bg-amber-400 rounded-full"
                style={{ width: `${(stats.scoreDistribution.medium / stats.total) * 100}%` }}
                title={`${stats.scoreDistribution.medium} em desenvolvimento`}
              />
            )}
            {stats.scoreDistribution.low > 0 && (
              <div
                className="bg-red-400 rounded-full"
                style={{ width: `${(stats.scoreDistribution.low / stats.total) * 100}%` }}
                title={`${stats.scoreDistribution.low} precisam atenção`}
              />
            )}
          </div>
          <div className="flex gap-4 mt-2">
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
              Excelente (≥80) — {stats.scoreDistribution.high}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
              Em desenvolvimento (60–79) — {stats.scoreDistribution.medium}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
              Precisa atenção (&lt;60) — {stats.scoreDistribution.low}
            </span>
          </div>
        </div>
      )}

      {/* Calls grid */}
      {calls.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-7 h-7 text-indigo-400" />
          </div>
          <h3 className="text-gray-900 font-semibold mb-1">Nenhuma call analisada ainda</h3>
          <p className="text-sm text-gray-400 max-w-sm mx-auto">
            Quando o n8n processar uma transcrição do Google Drive, ela aparecerá aqui automaticamente.
          </p>
        </div>
      ) : (
        <DashboardFilters calls={calls} />
      )}
    </div>
  )
}
