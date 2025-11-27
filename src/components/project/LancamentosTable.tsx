'use client'

import { ILancamento } from '@/app/backend/services/LancamentoService'
import { buscarTodosLancamentos } from '@/app/frontend/use-cases/LancamentoCases'
import { buscarTodosCentrosDeCusto } from '@/app/frontend/use-cases/CentroCustoCases'
import { SessionContext } from '@/app/proprietario/SessionProvider'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import CadastroDeLancamentoForm from './CadastroDeLancamentoForm'
import { Button } from '../ui/button'

export default function LancamentosTable() {
  const session = useContext(SessionContext)
  const { propriedadeSelecionadaId } = session
  const [lancamentos, setLancamentos] = useState<ILancamento[] | undefined>(
    undefined
  )
  const [centros, setCentros] = useState<Record<number, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLancamentoId, setSelectedLancamentoId] = useState<string | null>(
    null
  )
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const editDialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (!propriedadeSelecionadaId) return
    setIsLoading(true)
    buscarTodosLancamentos(propriedadeSelecionadaId)
      .then((data) => {
        setLancamentos(data?.data.dataConnection ?? [])
      })
      .finally(() => setIsLoading(false))

    buscarTodosCentrosDeCusto(propriedadeSelecionadaId).then((data) => {
      const mapa: Record<number, string> = {}
      data?.data.dataConnection.forEach((centro) => {
        if (centro.id) mapa[centro.id] = centro.nome ?? ''
      })
      setCentros(mapa)
    })
  }, [propriedadeSelecionadaId])

  function handleRowClick(id?: number) {
    if (!id) return
    setSelectedLancamentoId(String(id))
    setIsDialogOpen(true)
    editDialogRef.current?.showModal()
  }

  function openCreateDialog() {
    setSelectedLancamentoId(null)
    setIsDialogOpen(true)
    editDialogRef.current?.showModal()
  }

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        maximumFractionDigits: 2,
      }),
    []
  )

  return (
    <>
      <div className="mx-auto w-full max-w-5xl rounded-lg border border-border/40 bg-secondary-background shadow-inner shadow-black/20">
        <div className="flex items-center justify-between border-b border-border/40 px-4 py-3">
          <h2 className="text-base font-semibold text-foreground">
            Lançamentos Contábeis
          </h2>
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
                <th className="px-4 py-3 text-left font-medium">Valor</th>
                <th className="px-4 py-3 text-left font-medium">Tipo</th>
                <th className="px-4 py-3 text-left font-medium">Data</th>
                <th className="px-4 py-3 text-left font-medium">
                  Centro de Custo
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-muted-foreground"
                  >
                    Carregando lançamentos...
                  </td>
                </tr>
              )}

              {!isLoading && (!lancamentos || lancamentos.length === 0) && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-muted-foreground"
                  >
                    Nenhum lançamento cadastrado ainda.
                  </td>
                </tr>
              )}

              {!isLoading &&
                lancamentos?.map((lanc) => (
                  <tr
                    key={lanc.id}
                    className="cursor-pointer border-t border-border/30 transition-colors hover:bg-white/5 focus-within:bg-white/5"
                    onClick={() => handleRowClick(lanc.id)}
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {currencyFormatter.format(Number(lanc.valor))}
                    </td>
                    <td className="px-4 py-3 capitalize text-foreground/80">
                      {lanc.tipo_lancamento}
                    </td>
                    <td className="px-4 py-3 text-foreground/80">
                      {lanc.data_lancamento
                        ? new Date(lanc.data_lancamento).toLocaleDateString('pt-BR')
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-foreground/80">
                      {lanc.id_centro_custo
                        ? centros[lanc.id_centro_custo] ?? '—'
                        : '—'}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 p-4 md:hidden">
          {isLoading && (
            <p className="text-center text-sm text-muted-foreground">
              Carregando lançamentos...
            </p>
          )}

          {!isLoading && (!lancamentos || lancamentos.length === 0) && (
            <p className="text-center text-sm text-muted-foreground">
              Nenhum lançamento cadastrado ainda.
            </p>
          )}

          {!isLoading &&
            lancamentos?.map((lanc) => (
              <button
                key={`card-${lanc.id}`}
                type="button"
                onClick={() => handleRowClick(lanc.id)}
                className="w-full rounded-lg border border-border/40 bg-black/10 p-4 text-left shadow-inner shadow-black/10 transition-colors hover:bg-white/5"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">
                    {currencyFormatter.format(Number(lanc.valor))}
                  </p>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold capitalize text-foreground">
                    {lanc.tipo_lancamento}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-foreground/80">
                  <div>
                    <p className="text-muted-foreground">Data</p>
                    <p className="font-semibold">
                      {lanc.data_lancamento
                        ? new Date(lanc.data_lancamento).toLocaleDateString('pt-BR')
                        : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Centro de custo</p>
                    <p className="font-semibold">
                      {lanc.id_centro_custo
                        ? centros[lanc.id_centro_custo] ?? '—'
                        : '—'}
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
          <CadastroDeLancamentoForm
            key={selectedLancamentoId ?? 'novo-lancamento'}
            idLancamento={selectedLancamentoId ?? undefined}
          />
        )}
      </dialog>
    </>
  )
}
