'use client'

import { IFuncionario } from '@/app/backend/services/FuncionarioService'
import { buscarTodosFuncionariosDaPropriedade } from '@/app/frontend/use-cases/FuncionarioCases'
import { SessionContext } from '@/app/proprietario/SessionProvider'
import { useContext, useEffect, useState } from 'react'

export default function FuncionariosDaPropriedadeTable() {
  const session = useContext(SessionContext)
  const { idProprietario, propriedadeSelecionadaId } = session
  const [funcionarios, setFuncionarios] = useState<IFuncionario[] | undefined>(
    undefined
  )
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!idProprietario || !propriedadeSelecionadaId) return

    setIsLoading(true)
    buscarTodosFuncionariosDaPropriedade(
      idProprietario,
      propriedadeSelecionadaId
    )
      .then((data) => {
        setFuncionarios(data?.data.dataConnection ?? [])
      })
      .finally(() => setIsLoading(false))
  }, [idProprietario, propriedadeSelecionadaId])

  const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 2,
  })

  return (
    <>
      <div className="mx-auto w-full max-w-5xl rounded-lg border border-border/40 bg-secondary-background shadow-inner shadow-black/20">
        <div className="flex items-center justify-between border-b border-border/40 px-4 py-3">
          <h2 className="text-base font-semibold text-foreground">
            Funcionários
          </h2>
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
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-muted-foreground"
                  >
                    Carregando funcionários...
                  </td>
                </tr>
              )}

              {!isLoading && (!funcionarios || funcionarios.length === 0) && (
                <tr>
                  <td
                    colSpan={5}
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
        </div>
      </div>
    </>
  )
}
