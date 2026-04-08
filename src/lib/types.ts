export interface Methodology {
  rapport: number       // 0–10
  discovery: number     // 0–10
  presentation: number  // 0–10
  objectionHandling: number // 0–10
  closing: number       // 0–10
}

export interface NextStep {
  action: string
  responsible: 'vendedor' | 'prospect' | 'ambos'
  dueDate: string | null   // e.g. "2 dias", "1 semana"
  priority: 'alta' | 'media' | 'baixa'
  completed: boolean
}

export interface HubSpotFields {
  dealStage: string | null
  amount: number | null
  closeDate: string | null   // ISO date
  notes: string | null
  nextActivityDate: string | null
  nextActivityType: 'call' | 'email' | 'meeting' | 'task' | null
  leadStatus: string | null
}

export type CallStatus = 'pending' | 'analyzed' | 'synced' | 'error'

export interface CallAnalysis {
  id: string
  createdAt: string         // ISO
  callDate: string          // ISO
  duration: number          // minutes
  vendorName: string
  prospectName: string
  company: string
  transcriptUrl: string | null
  // AI output
  score: number             // 0–100
  summary: string
  strengths: string[]
  improvements: string[]
  methodology: Methodology
  nextSteps: NextStep[]
  hubspotFields: HubSpotFields
  // HubSpot sync
  hubspotDealId: string | null
  hubspotSynced: boolean
  status: CallStatus
}

// Payload posted by n8n to /api/webhook
export interface WebhookPayload {
  secret?: string
  vendorName: string
  prospectName: string
  company: string
  callDate: string
  duration: number
  transcriptUrl?: string
  hubspotDealId?: string
  analysis: {
    score: number
    summary: string
    strengths: string[]
    improvements: string[]
    methodology: Methodology
    nextSteps: Omit<NextStep, 'completed'>[]
    hubspotFields: HubSpotFields
  }
}

export interface DashboardStats {
  total: number
  avgScore: number
  hubspotSynced: number
  pendingNextSteps: number
  scoreDistribution: { high: number; medium: number; low: number }
}
