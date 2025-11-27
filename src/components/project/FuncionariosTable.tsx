'use client'

import { IFuncionario } from '@/app/backend/services/FuncionarioService'
import { buscarTodosFuncionariosDoProprietario } from '@/app/frontend/use-cases/FuncionarioCases'
import { SessionContext } from '@/app/proprietario/SessionProvider'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import CadastroDeFuncionarioForm from './CadastroDeFuncionarioForm'
import { Button } from '../ui/button'

export default function FuncionariosTable() {
  const session = useContext(SessionContext)
  const { idProprietario, propriedades } = session
  const [funcionarios, setFuncionarios] = useState<IFuncionario[] | undefined>(
    undefined
  )
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFuncionarioId, setSelectedFuncionarioId] = useState<
    string | null
  >(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const editDialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (!idProprietario) return

    setIsLoading(true)
    buscarTodosFuncionariosDoProprietario(idProprietario).then((data) => {
      setFuncionarios(data?.data.dataConnection ?? [])
      setIsLoading(false)
    })
  }, [idProprietario])

  function handleRowClick(id?: number) {
    if (!id) return
    setSelectedFuncionarioId(String(id))
    setIsDialogOpen(true)
    editDialogRef.current?.showModal()
  }

  function openCreateDialog() {
    setSelectedFuncionarioId(null)
    setIsDialogOpen(true)
    editDialogRef.current?.showModal()
  }

  const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 2,
  })

  const propriedadePorId = useMemo(() => {
    const mapa = new Map<number, string>()
    propriedades.forEach((prop) => {
      if (prop.id != null) mapa.set(prop.id, prop.endereco ?? '')
    })
    return mapa
  }, [propriedades])

  return (
    <>
      <div className="mx-auto w-full max-w-5xl rounded-lg border border-border/40 bg-secondary-background shadow-inner shadow-black/20">
        <div className="flex items-center justify-between border-b border-border/40 px-4 py-3">
          <h2 className="text-base font-semibold text-foreground">
            Funcionários
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
                <th className="px-4 py-3 text-left font-medium">CPF</th>
                <th className="px-4 py-3 text-left font-medium">Cargo</th>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-left font-medium">Custo</th>
                <th className="px-4 py-3 text-left font-medium">
                  Tipo de custo
                </th>
                <th className="px-4 py-3 text-left font-medium">Propriedade</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-muted-foreground"
                  >
                    Carregando funcionários...
                  </td>
                </tr>
              )}

              {!isLoading && (!funcionarios || funcionarios.length === 0) && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-muted-foreground"
                  >
                    Nenhum funcionário cadastrado ainda.
                  </td>
                </tr>
              )}

              {!isLoading &&
                funcionarios?.map((funcionario) => (
                  <tr
                    key={funcionario.id}
                    className="cursor-pointer border-t border-border/30 transition-colors hover:bg-white/5 focus-within:bg-white/5"
                    onClick={() => handleRowClick(funcionario.id)}
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {funcionario.nome}
                    </td>
                    <td className="px-4 py-3 text-foreground/80">
                      {funcionario.cpf}
                    </td>
                    <td className="px-4 py-3 text-foreground/80">
                      {funcionario.cargo}
                    </td>
                    <td className="px-4 py-3 text-foreground/80">
                      {funcionario.email ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-foreground/80">
                      {funcionario.custo
                        ? currencyFormatter.format(Number(funcionario.custo))
                        : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                          funcionario.tipo_custo === 'mensal'
                            ? 'bg-blue-500/20 text-blue-200'
                            : 'bg-purple-500/20 text-purple-200'
                        }`}
                      >
                        {funcionario.tipo_custo
                          ? funcionario.tipo_custo === 'mensal'
                            ? 'Mensal'
                            : 'Diária'
                          : '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-foreground/80">
                      {propriedadePorId.get(funcionario.id_propriedade ?? 0) ||
                        '—'}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 p-4 md:hidden">
          {isLoading && (
            <p className="text-center text-sm text-muted-foreground">
              Carregando funcionários...
            </p>
          )}

          {!isLoading && (!funcionarios || funcionarios.length === 0) && (
            <p className="text-center text-sm text-muted-foreground">
              Nenhum funcionário cadastrado ainda.
            </p>
          )}

          {!isLoading &&
            funcionarios?.map((funcionario) => (
              <button
                key={`card-${funcionario.id}`}
                type="button"
                onClick={() => handleRowClick(funcionario.id)}
                className="w-full rounded-lg border border-border/40 bg-black/10 p-4 text-left shadow-inner shadow-black/10 transition-colors hover:bg-white/5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {funcionario.nome}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      CPF: {funcionario.cpf}
                    </p>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold capitalize text-foreground">
                    {funcionario.tipo_custo ?? '—'}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-foreground/80">
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-semibold">{funcionario.email ?? '—'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Custo</p>
                    <p className="font-semibold">
                      {funcionario.custo
                        ? currencyFormatter.format(Number(funcionario.custo))
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
          <CadastroDeFuncionarioForm
            key={selectedFuncionarioId ?? 'novo-funcionario'}
            idFuncionario={selectedFuncionarioId ?? undefined}
          />
        )}
      </dialog>
    </>
  )
}
