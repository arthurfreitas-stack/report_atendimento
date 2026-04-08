'use client'

import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { CallAnalysis } from '@/lib/types'
import CallCard from './CallCard'
import clsx from 'clsx'

interface Props {
  calls: CallAnalysis[]
}

type ScoreFilter = 'all' | 'high' | 'medium' | 'low'

export default function DashboardFilters({ calls }: Props) {
  const [search, setSearch] = useState('')
  const [scoreFilter, setScoreFilter] = useState<ScoreFilter>('all')
  const [vendorFilter, setVendorFilter] = useState('all')

  const vendors = useMemo(() => {
    const names = [...new Set(calls.map(c => c.vendorName))]
    return names.sort()
  }, [calls])

  const filtered = useMemo(() => {
    return calls.filter(c => {
      const matchSearch =
        !search ||
        c.prospectName.toLowerCase().includes(search.toLowerCase()) ||
        c.company.toLowerCase().includes(search.toLowerCase()) ||
        c.vendorName.toLowerCase().includes(search.toLowerCase())

      const matchScore =
        scoreFilter === 'all' ||
        (scoreFilter === 'high' && c.score >= 80) ||
        (scoreFilter === 'medium' && c.score >= 60 && c.score < 80) ||
        (scoreFilter === 'low' && c.score < 60)

      const matchVendor = vendorFilter === 'all' || c.vendorName === vendorFilter

      return matchSearch && matchScore && matchVendor
    })
  }, [calls, search, scoreFilter, vendorFilter])

  const scoreFilters: { value: ScoreFilter; label: string }[] = [
    { value: 'all', label: 'Todos os scores' },
    { value: 'high', label: 'Excelente (≥80)' },
    { value: 'medium', label: 'Em desenvolvimento' },
    { value: 'low', label: 'Precisa atenção' },
  ]

  return (
    <div>
      {/* Filters bar */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar prospect, empresa, vendedor..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {scoreFilters.map(f => (
            <button
              key={f.value}
              onClick={() => setScoreFilter(f.value)}
              className={clsx(
                'px-3 py-2.5 rounded-xl text-sm font-medium border transition-colors whitespace-nowrap',
                scoreFilter === f.value
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {vendors.length > 1 && (
          <select
            value={vendorFilter}
            onChange={e => setVendorFilter(e.target.value)}
            className="px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="all">Todos os vendedores</option>
            {vendors.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        )}
      </div>

      {/* Results */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {filtered.length} {filtered.length === 1 ? 'call encontrada' : 'calls encontradas'}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p>Nenhuma call corresponde aos filtros aplicados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(c => <CallCard key={c.id} call={c} />)}
        </div>
      )}
    </div>
  )
}
