import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

import { SYSTEM_CONTEXT, formatDynamicContext } from '@/app/ai'
import { logInfo, logError } from '@/app/ai/logger'
import type { ResponseCreateParams } from 'openai/resources/responses/responses'

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})
/* eslint-disable @typescript-eslint/no-explicit-any */
export async function POST(req: NextRequest) {
  try {
    const { message, context, history } = await req.json()
    logInfo(
      'Mensagem recebida:',
      message,
      'Contexto enviado:',
      context,
      'Histórico:',
      history
    )

    if (!message) {
      return NextResponse.json(
        { error: 'Mensagem não fornecida.' },
        { status: 400 }
      )
    }

    const dynamicContext = formatDynamicContext(context)

    const historyItems: ResponseCreateParams['input'] = Array.isArray(history)
      ? history
          .filter(
            (item: any) =>
              item &&
              typeof item.content === 'string' &&
              (item.role === 'user' || item.role === 'assistant')
          )
          .map((item: any) => ({
            role: item.role,
            content: item.content,
            type: 'message' as const,
          }))
      : []

    const input: ResponseCreateParams['input'] = []

    input.push({
      role: 'system',
      content: SYSTEM_CONTEXT,
      type: 'message',
    } as const)

    if (dynamicContext) {
      input.push({
        role: 'developer',
        content: dynamicContext,
        type: 'message',
      } as const)
    }

    input.push(...historyItems)

    input.push({
      role: 'user',
      content: message,
      type: 'message',
    } as const)

    console.log('input final:')
    JSON.stringify(input, null, 2)

    const response = await client.responses.create({
      model: 'gpt-4.1',
      input,
    })

    const finalMessage = response.output_text

    return NextResponse.json({ message: finalMessage })
  } catch (error) {
    logError('Erro na rota /api/chat:', error)
    console.error('Erro na rota /api/chat:', error)
    return NextResponse.json(
      { error: 'Erro interno no servidor.' },
      { status: 500 }
    )
  }
}
