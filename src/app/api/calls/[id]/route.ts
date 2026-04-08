import { NextRequest, NextResponse } from 'next/server'
import { getCall, updateCall, deleteCall } from '@/lib/store'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const call = await getCall(params.id)
  if (!call) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
  return NextResponse.json(call)
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const updated = await updateCall(params.id, body)
    if (!updated) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
    return NextResponse.json(updated)
  } catch (err) {
    console.error('PATCH /api/calls/[id] error:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const deleted = await deleteCall(params.id)
  if (!deleted) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
  return NextResponse.json({ success: true })
}
