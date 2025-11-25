'use client'

import { ITarefa } from '@/app/backend/services/TarefaService'
import { buscarTodasTarefas } from '@/app/frontend/use-cases/TarefaCases'
import { SessionContext } from '@/app/proprietario/SessionProvider'
import { useContext, useEffect, useRef, useState } from 'react'
import CadastroDeTarefaForm from './CadastroDeTarefaForm'
import { Button } from '../ui/button'

const statusLabel: Record<ITarefa['status'], string> = {
  a_fazer: 'A Fazer',
  fazendo: 'Fazendo',
  validando: 'Validando',
  entregue: 'Entregue',
}

const prioridadeLabel: Record<ITarefa['prioridade'], string> = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
  urgente: 'Urgente',
}

export default function TarefasTable() {
  const session = useContext(SessionContext)
  const { propriedadeSelecionadaId } = session
  const [tarefas, setTarefas] = useState<ITarefa[] | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTarefaId, setSelectedTarefaId] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const editDialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (!propriedadeSelecionadaId) return
    setIsLoading(true)
    buscarTodasTarefas(propriedadeSelecionadaId)
      .then((data) => {
        const lista = data?.data.dataConnection ?? []
        setTarefas(Array.isArray(lista) ? lista : [lista])
      })
      .finally(() => setIsLoading(false))
  }, [propriedadeSelecionadaId])

  function handleRowClick(id?: number) {
    if (!id) return
    setSelectedTarefaId(String(id))
    setIsDialogOpen(true)
    editDialogRef.current?.showModal()
  }

  function openCreateDialog() {
    setSelectedTarefaId(null)
    setIsDialogOpen(true)
    editDialogRef.current?.showModal()
  }

  function formatDate(dateValue?: Date | string | null) {
    if (!dateValue) return '—'
    const parsed = new Date(dateValue)
    if (Number.isNaN(parsed.getTime())) return '—'
    return parsed.toLocaleDateString('pt-BR')
  }

  return (
    <>
      <div className="mx-auto w-full max-w-5xl rounded-lg border border-border/40 bg-secondary-background shadow-inner shadow-black/20">
        <div className="flex items-center justify-between border-b border-border/40 px-4 py-3">
          <h2 className="text-base font-semibold text-foreground">Tarefas</h2>
          <Button
            type="button"
            variant="secondary"
            className="flex items-center gap-2"
            onClick={openCreateDialog}
          >
            <span className="text-lg leading-none" aria-hidden="true">
              +
            </span>
            Adicionar
          </Button>
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full text-sm">
            <thead className="bg-black/20 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Título</th>
                <th className="px-4 py-3 text-left font-medium">Início</th>
                <th className="px-4 py-3 text-left font-medium">Dias Úteis</th>
                <th className="px-4 py-3 text-left font-medium">
                  Horas Trabalho
                </th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Prioridade</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-muted-foreground"
                  >
                    Carregando tarefas...
                  </td>
                </tr>
              )}

              {!isLoading && (!tarefas || tarefas.length === 0) && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-muted-foreground"
                  >
                    Nenhuma tarefa cadastrada ainda.
                  </td>
                </tr>
              )}

              {!isLoading &&
                tarefas?.map((tarefa) => (
                  <tr
                    key={tarefa.id}
                    className="cursor-pointer border-t border-border/30 transition-colors hover:bg-white/5 focus-within:bg-white/5"
                    onClick={() => handleRowClick(tarefa.id)}
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {tarefa.titulo}
                    </td>
                    <td className="px-4 py-3 text-foreground/80">
                      {formatDate(tarefa.data_inicio)}
                    </td>
                    <td className="px-4 py-3 text-foreground/80">
                      {tarefa.dias_uteis ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-foreground/80">
                      {tarefa.horas_trabalho ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                          tarefa.status === 'entregue'
                            ? 'bg-emerald-500/20 text-emerald-200'
                            : tarefa.status === 'validando'
                              ? 'bg-amber-500/20 text-amber-200'
                              : tarefa.status === 'fazendo'
                                ? 'bg-blue-500/20 text-blue-200'
                                : 'bg-slate-500/20 text-slate-200'
                        }`}
                      >
                        {statusLabel[tarefa.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                          tarefa.prioridade === 'urgente'
                            ? 'bg-red-500/20 text-red-200'
                            : tarefa.prioridade === 'alta'
                              ? 'bg-orange-500/20 text-orange-200'
                              : tarefa.prioridade === 'media'
                                ? 'bg-amber-500/20 text-amber-200'
                                : 'bg-emerald-500/20 text-emerald-200'
                        }`}
                      >
                        {prioridadeLabel[tarefa.prioridade]}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 p-4 md:hidden">
          {isLoading && (
            <p className="text-center text-sm text-muted-foreground">
              Carregando tarefas...
            </p>
          )}

          {!isLoading && (!tarefas || tarefas.length === 0) && (
            <p className="text-center text-sm text-muted-foreground">
              Nenhuma tarefa cadastrada ainda.
            </p>
          )}

          {!isLoading &&
            tarefas?.map((tarefa) => (
              <button
                key={`card-${tarefa.id}`}
                type="button"
                onClick={() => handleRowClick(tarefa.id)}
                className="w-full rounded-lg border border-border/40 bg-black/10 p-4 text-left shadow-inner shadow-black/10 transition-colors hover:bg-white/5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {tarefa.titulo}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Início: {formatDate(tarefa.data_inicio)}
                    </p>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold capitalize text-foreground">
                    {statusLabel[tarefa.status]}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-foreground/80">
                  <div>
                    <p className="text-muted-foreground">Dias úteis</p>
                    <p className="font-semibold">{tarefa.dias_uteis ?? '—'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Horas</p>
                    <p className="font-semibold">
                      {tarefa.horas_trabalho ?? '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Prioridade</p>
                    <p className="font-semibold">
                      {prioridadeLabel[tarefa.prioridade]}
                    </p>
                  </div>
                </div>
              </button>
            ))}
        </div>
      </div>

      <dialog
        ref={editDialogRef}
        className="fixed top-1/2 left-1/2 w-[90%] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-secondary-background p-6 shadow-lg shadow-black/40"
      >
        {isDialogOpen && (
          <CadastroDeTarefaForm
            key={selectedTarefaId ?? 'nova-tarefa'}
            idTarefa={selectedTarefaId ?? undefined}
          />
        )}
      </dialog>
    </>
  )
}
