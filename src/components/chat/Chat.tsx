'use client'

import ReactMarkdown from 'react-markdown'
import { useState } from 'react'

type DynamicContext = string | Record<string, unknown> | null | undefined

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatProps {
  context?: DynamicContext
}
/* eslint-disable @typescript-eslint/no-explicit-any */
export function Chat({ context }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  type Item = Record<string, unknown>
  const isContextObject =
    context && typeof context === 'object' && !Array.isArray(context)
  const resourceCards = isContextObject
    ? ([
        {
          title: 'Funcionários',
          items:
            Array.isArray((context as any).listaFuncionarios) &&
            (context as any).listaFuncionarios.length
              ? ((context as any).listaFuncionarios as Item[])
              : [],
        },
        {
          title: 'Maquinários',
          items:
            Array.isArray((context as any).listaMaquinarios) &&
            (context as any).listaMaquinarios.length
              ? ((context as any).listaMaquinarios as Item[])
              : [],
        },
        {
          title: 'Insumos',
          items:
            Array.isArray((context as any).listaInsumos) &&
            (context as any).listaInsumos.length
              ? ((context as any).listaInsumos as Item[])
              : [],
        },
      ] satisfies { title: string; items: Item[] }[])
    : []

  const formatResourceItem = (title: string, item: Item) => {
    if (title === 'Funcionários') {
      const nome = (item.nome as string) || 'Sem nome'
      const cargo = (item.cargo as string) || 'Sem cargo'
      return `${nome} (${cargo})`
    }

    if (title === 'Maquinários') {
      return (item.modelo as string) || 'Sem modelo'
    }

    if (title === 'Insumos') {
      const nome = (item.nome as string) || 'Sem nome'
      const quantidade = item.quantidade ? String(item.quantidade) : ''
      const unidade = (item.unidade_medida as string) || ''
      return [nome, quantidade, unidade].filter(Boolean).join(' ').trim()
    }

    return JSON.stringify(item)
  }

  async function sendMessage() {
    if (!input.trim()) return
    setError(null)
    setIsLoading(true)

    const userMessage: Message = {
      role: 'user',
      content: input,
    }

    const newHistory = [...messages, userMessage]
    setMessages(newHistory)

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input, context, history: newHistory }),
    })

    if (!response.ok) {
      setError('Falha ao obter resposta. Tente novamente.')
      setIsLoading(false)
      return
    }

    const data = await response.json()

    const assistantMessage: Message = {
      role: 'assistant',
      content: data.message ?? 'Erro ao interpretar resposta.',
    }

    setMessages((prev) => [...prev, assistantMessage])

    setInput('')
    setIsLoading(false)
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4 flex flex-col gap-4 bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      {resourceCards.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {resourceCards.map((card) => (
            <div
              key={card.title}
              className="rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] p-3 text-sm shadow-sm"
            >
              <div className="font-semibold mb-2">{card.title}</div>
              {card.items.length > 0 ? (
                <ul className="text-xs leading-relaxed list-disc pl-4 space-y-1">
                  {card.items.map((item, idx) => (
                    <li key={idx}>{formatResourceItem(card.title, item)}</li>
                  ))}
                </ul>
              ) : (
                <div className="text-xs opacity-70">Sem dados</div>
              )}
            </div>
          ))}
        </div>
      ) : context ? (
        <div className="rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--secondary))] p-3 text-sm text-[hsl(var(--secondary-foreground))] shadow-sm">
          <div className="font-semibold mb-1">Recursos da propriedade</div>
          <pre className="whitespace-pre-wrap text-xs text-[hsl(var(--secondary-foreground))]">
            {typeof context === 'string'
              ? context
              : JSON.stringify(context, null, 2)}
          </pre>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 border border-[hsl(var(--border))] rounded p-4 h-[70vh] overflow-y-auto bg-[hsl(var(--card))] shadow-sm">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg max-w-[80%] leading-relaxed shadow-sm ${
              msg.role === 'user'
                ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] self-end'
                : 'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] border border-[hsl(var(--border))] self-start'
            }`}
          >
            <div className="text-xs font-semibold mb-1 opacity-80">
              {msg.role === 'user' ? 'Você' : 'Assistente'}
            </div>
            <div className="prose prose-sm max-w-none whitespace-pre-wrap">
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}

        {isLoading ? (
          <div className="self-start text-sm text-[hsl(var(--muted-foreground))]">
            Digitando…
          </div>
        ) : null}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border border-[hsl(var(--border))] rounded p-2 bg-[hsl(var(--input))] text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
          value={input}
          placeholder="Digite sua mensagem..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
          disabled={isLoading}
        />

        <button
          className="px-4 py-2 rounded bg-[hsl(var(--btn-primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--btn-primary-hover))] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          onClick={sendMessage}
          disabled={isLoading}
        >
          {isLoading ? 'Enviando...' : 'Enviar'}
        </button>
      </div>

      {error ? (
        <div className="text-sm text-[hsl(var(--destructive-foreground))] border border-[hsl(var(--destructive))] bg-[hsl(var(--destructive))]/10 rounded p-2">
          {error}
        </div>
      ) : null}
    </div>
  )
}
