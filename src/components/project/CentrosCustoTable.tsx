'use client'

import { ICentroCusto } from '@/app/backend/services/CentroCustoService'
import { buscarTodosCentrosDeCusto } from '@/app/frontend/use-cases/CentroCustoCases'
import { SessionContext } from '@/app/proprietario/SessionProvider'
import { useContext, useEffect, useRef, useState } from 'react'
import CadastroDeCentroCustoForm from './CadastroDeCentroCustoForm'
import { Button } from '../ui/button'

export default function CentrosCustoTable() {
  const session = useContext(SessionContext)
  const { propriedadeSelecionadaId } = session
  const [centros, setCentros] = useState<ICentroCusto[] | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCentroId, setSelectedCentroId] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const editDialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (!propriedadeSelecionadaId) return
    setIsLoading(true)
    buscarTodosCentrosDeCusto(propriedadeSelecionadaId)
      .then((data) => {
        setCentros(data?.data.dataConnection ?? [])
      })
      .finally(() => setIsLoading(false))
  }, [propriedadeSelecionadaId])

  function handleRowClick(id?: number) {
    if (!id) return
    setSelectedCentroId(String(id))
    setIsDialogOpen(true)
    editDialogRef.current?.showModal()
  }

  function openCreateDialog() {
    setSelectedCentroId(null)
    setIsDialogOpen(true)
    editDialogRef.current?.showModal()
  }

  return (
    <>
      <div className="mx-auto w-full max-w-5xl rounded-lg border border-border/40 bg-secondary-background shadow-inner shadow-black/20">
        <div className="flex items-center justify-between border-b border-border/40 px-4 py-3">
          <h2 className="text-base font-semibold text-foreground">
            Centros de Custo
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
                <th className="px-4 py-3 text-left font-medium">Nome</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td
                    colSpan={1}
                    className="px-4 py-6 text-center text-muted-foreground"
                  >
                    Carregando centros de custo...
                  </td>
                </tr>
              )}

              {!isLoading && (!centros || centros.length === 0) && (
                <tr>
                  <td
                    colSpan={1}
                    className="px-4 py-6 text-center text-muted-foreground"
                  >
                    Nenhum centro de custo cadastrado ainda.
                  </td>
                </tr>
              )}

              {!isLoading &&
                centros?.map((centro) => (
                  <tr
                    key={centro.id}
                    className="cursor-pointer border-t border-border/30 transition-colors hover:bg-white/5 focus-within:bg-white/5"
                    onClick={() => handleRowClick(centro.id)}
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {centro.nome}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 p-4 md:hidden">
          {isLoading && (
            <p className="text-center text-sm text-muted-foreground">
              Carregando centros de custo...
            </p>
          )}

          {!isLoading && (!centros || centros.length === 0) && (
            <p className="text-center text-sm text-muted-foreground">
              Nenhum centro de custo cadastrado ainda.
            </p>
          )}

          {!isLoading &&
            centros?.map((centro) => (
              <button
                key={`card-${centro.id}`}
                type="button"
                onClick={() => handleRowClick(centro.id)}
                className="w-full rounded-lg border border-border/40 bg-black/10 p-4 text-left shadow-inner shadow-black/10 transition-colors hover:bg-white/5"
              >
                <p className="text-sm font-semibold text-foreground">
                  {centro.nome}
                </p>
              </button>
            ))}
        </div>
      </div>

      <dialog
        ref={editDialogRef}
        className="fixed top-1/2 left-1/2 w-[90%] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-secondary-background p-6 shadow-lg shadow-black/40"
      >
        {isDialogOpen && (
          <CadastroDeCentroCustoForm
            key={selectedCentroId ?? 'novo-centro'}
            idCentroCusto={selectedCentroId ?? undefined}
          />
        )}
      </dialog>
    </>
  )
}
