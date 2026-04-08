import { NextRequest, NextResponse } from 'next/server'
import { saveCall } from '@/lib/store'
import { CallAnalysis, WebhookPayload } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const body: WebhookPayload = await req.json()

    const secret = process.env.WEBHOOK_SECRET
    if (secret && body.secret !== secret) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const id = crypto.randomUUID()
    const now = new Date().toISOString()

    const call: CallAnalysis = {
      id,
      createdAt: now,
      callDate: body.callDate,
      duration: body.duration,
      vendorName: body.vendorName,
      prospectName: body.prospectName,
      company: body.company,
      transcriptUrl: body.transcriptUrl ?? null,
      transcript: body.transcript,
      score: body.analysis.score,
      summary: body.analysis.summary,
      strengths: body.analysis.strengths,
      improvements: body.analysis.improvements,
      methodology: body.analysis.methodology,
      nextSteps: body.analysis.nextSteps.map(s => ({ ...s, completed: false })),
      hubspotFields: body.analysis.hubspotFields,
      hubspotDealId: body.hubspotDealId ?? null,
      hubspotSynced: false,
      status: 'analyzed',
    }

    await saveCall(call)

    return NextResponse.json({ id, success: true }, { status: 201 })
  } catch (err) {
    console.error('POST /api/webhook error:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
