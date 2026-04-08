import fs from 'fs'
import path from 'path'
import { CallAnalysis, DashboardStats } from './types'

const DATA_DIR = path.join(process.cwd(), 'data', 'calls')

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

export function getAllCalls(): CallAnalysis[] {
  ensureDir()
  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'))
  return files
    .map(f => JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), 'utf-8')) as CallAnalysis)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function getCall(id: string): CallAnalysis | null {
  ensureDir()
  const filePath = path.join(DATA_DIR, `${id}.json`)
  if (!fs.existsSync(filePath)) return null
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as CallAnalysis
}

export function saveCall(call: CallAnalysis): void {
  ensureDir()
  fs.writeFileSync(path.join(DATA_DIR, `${call.id}.json`), JSON.stringify(call, null, 2))
}

export function updateCall(id: string, updates: Partial<CallAnalysis>): CallAnalysis | null {
  const call = getCall(id)
  if (!call) return null
  const updated = { ...call, ...updates }
  saveCall(updated)
  return updated
}

export function deleteCall(id: string): boolean {
  ensureDir()
  const filePath = path.join(DATA_DIR, `${id}.json`)
  if (!fs.existsSync(filePath)) return false
  fs.unlinkSync(filePath)
  return true
}

export function getStats(): DashboardStats {
  const calls = getAllCalls()
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
