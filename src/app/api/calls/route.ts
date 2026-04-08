import { NextResponse } from 'next/server'
import { getAllCalls } from '@/lib/store'

export async function GET() {
  try {
    const calls = getAllCalls()
    return NextResponse.json(calls)
  } catch (err) {
    console.error('GET /api/calls error:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
