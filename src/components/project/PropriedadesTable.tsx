'use client'

import { IPropriedade } from '@/app/backend/services/PropriedadeService'
import { buscarTodasPropriedades } from '@/app/frontend/use-cases/PropriedadeCases'
import { SessionContext } from '@/app/proprietario/SessionProvider'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import CadastroDePropriedadeForm from './CadastroDePropriedadeForm'
import { Button } from '../ui/button'

export default function PropriedadesTable() {
  const session = useContext(SessionContext)
  const { idProprietario } = session
  const [propriedades, setPropriedades] = useState<IPropriedade[] | undefined>(
    undefined
  )
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPropriedadeId, setSelectedPropriedadeId] = useState<
    string | null
  >(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const editDialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (!idProprietario) return
    setIsLoading(true)
    buscarTodasPropriedades(idProprietario)
      .then((data) => {
        setPropriedades(data?.data.dataConnection ?? [])
      })
      .finally(() => setIsLoading(false))
  }, [idProprietario])

  function handleRowClick(id?: number) {
    if (!id) return
    setSelectedPropriedadeId(String(id))
    setIsDialogOpen(true)
    editDialogRef.current?.showModal()
  }

  function openCreateDialog() {
    setSelectedPropriedadeId(null)
    setIsDialogOpen(true)
    editDialogRef.current?.showModal()
  }

  const cnpjFormatter = useMemo(
    () => (cnpj?: string | null) =>
      cnpj && cnpj.length === 14
        ? cnpj.replace(
            /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
            '$1.$2.$3/$4-$5'
          )
        : cnpj || '—',
    []
  )

  return (
    <>
      <div className="mx-auto w-full max-w-5xl rounded-lg border border-border/40 bg-secondary-background shadow-inner shadow-black/20">
        <div className="flex items-center justify-between border-b border-border/40 px-4 py-3">
          <h2 className="text-base font-semibold text-foreground">
            Propriedades
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
                <th className="px-4 py-3 text-left font-medium">Endereço</th>
                <th className="px-4 py-3 text-left font-medium">Gerente</th>
                <th className="px-4 py-3 text-left font-medium">CNPJ</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-6 text-center text-muted-foreground"
                  >
                    Carregando propriedades...
                  </td>
                </tr>
              )}

              {!isLoading && (!propriedades || propriedades.length === 0) && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-6 text-center text-muted-foreground"
                  >
                    Nenhuma propriedade cadastrada ainda.
                  </td>
                </tr>
              )}

              {!isLoading &&
                propriedades?.map((prop) => (
                  <tr
                    key={prop.id}
                    className="cursor-pointer border-t border-border/30 transition-colors hover:bg-white/5 focus-within:bg-white/5"
                    onClick={() => handleRowClick(prop.id)}
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {prop.endereco}
                    </td>
                    <td className="px-4 py-3 text-foreground/80">
                      {prop.gerente ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-foreground/80">
                      {cnpjFormatter(prop.cnpj)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 p-4 md:hidden">
          {isLoading && (
            <p className="text-center text-sm text-muted-foreground">
              Carregando propriedades...
            </p>
          )}

          {!isLoading && (!propriedades || propriedades.length === 0) && (
            <p className="text-center text-sm text-muted-foreground">
              Nenhuma propriedade cadastrada ainda.
            </p>
          )}

          {!isLoading &&
            propriedades?.map((prop) => (
              <button
                key={`card-${prop.id}`}
                type="button"
                onClick={() => handleRowClick(prop.id)}
                className="w-full rounded-lg border border-border/40 bg-black/10 p-4 text-left shadow-inner shadow-black/10 transition-colors hover:bg-white/5"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">
                    {prop.endereco}
                  </p>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-foreground">
                    {prop.gerente ?? '—'}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  CNPJ: {cnpjFormatter(prop.cnpj)}
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
          <CadastroDePropriedadeForm
            key={selectedPropriedadeId ?? 'nova-propriedade'}
            idPropriedade={selectedPropriedadeId ?? undefined}
          />
        )}
      </dialog>
    </>
  )
}
