import { createClient } from '@supabase/supabase-js'
import { CallAnalysis, DashboardStats } from './types'

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function getAllCalls(): Promise<CallAnalysis[]> {
  const { data, error } = await db()
    .from('calls')
    .select('data')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map(row => row.data as CallAnalysis)
}

export async function getCall(id: string): Promise<CallAnalysis | null> {
  const { data, error } = await db()
    .from('calls')
    .select('data')
    .eq('id', id)
    .single()
  if (error) return null
  return data?.data as CallAnalysis
}

export async function saveCall(call: CallAnalysis): Promise<void> {
  const { error } = await db()
    .from('calls')
    .upsert({ id: call.id, created_at: call.createdAt, data: call })
  if (error) throw error
}

export async function updateCall(id: string, updates: Partial<CallAnalysis>): Promise<CallAnalysis | null> {
  const call = await getCall(id)
  if (!call) return null
  const updated = { ...call, ...updates }
  await saveCall(updated)
  return updated
}

export async function deleteCall(id: string): Promise<boolean> {
  const { error } = await db().from('calls').delete().eq('id', id)
  return !error
}

export async function getStats(): Promise<DashboardStats> {
  const calls = await getAllCalls()
  const total = calls.length

  if (total === 0) {
    return { total: 0, avgScore: 0, hubspotSynced: 0, pendingNextSteps: 0, scoreDistribution: { high: 0, medium: 0, low: 0 } }
  }

  const avgScore = Math.round(calls.reduce((sum, c) => sum + c.score, 0) / total)
  const hubspotSynced = calls.filter(c => c.hubspotSynced).length
  const pendingNextSteps = calls.reduce(
    (sum, c) => sum + c.nextSteps.filter(s => !s.completed).length,
    0
  )
  const scoreDistribution = {
    high: calls.filter(c => c.score >= 80).length,
    medium: calls.filter(c => c.score >= 60 && c.score < 80).length,
    low: calls.filter(c => c.score < 60).length,
  }

  return { total, avgScore, hubspotSynced, pendingNextSteps, scoreDistribution }
}
