'use client'

import { IMaquinario } from '@/app/backend/services/MaquinarioService'
import { buscarTodosMaquinariosDaPropriedade } from '@/app/frontend/use-cases/MaquinarioCases'
import { SessionContext } from '@/app/proprietario/SessionProvider'
import { useContext, useEffect, useState } from 'react'

export default function MaquinariosTableDaPropriedade() {
  const session = useContext(SessionContext)
  const { idProprietario, propriedadeSelecionadaId } = session
  const [maquinarios, setMaquinarios] = useState<IMaquinario[] | undefined>(
    undefined
  )
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!idProprietario || !propriedadeSelecionadaId) return
    buscarTodosMaquinariosDaPropriedade(
      idProprietario ?? 0,
      propriedadeSelecionadaId ?? 0
    ).then((data) => {
      setMaquinarios(data?.data.dataConnection ?? [])
      setIsLoading(false)
    })
  }, [idProprietario, propriedadeSelecionadaId])

  const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  return (
    <>
      <div className="mx-auto w-full max-w-5xl bg-secondary-background rounded-lg border border-border/40 shadow-inner shadow-black/20">
        <div className="flex items-center justify-between border-b border-border/40 px-4 py-3">
          <h2 className="text-base font-semibold text-foreground">
            Maquinários
          </h2>
        </div>
        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full text-sm">
            <thead className="bg-black/20 text-muted-foreground uppercase text-xs tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Modelo</th>
                <th className="px-4 py-3 text-left font-medium">
                  Ano fabricação
                </th>
                <th className="px-4 py-3 text-left font-medium">Custo</th>
                <th className="px-4 py-3 text-left font-medium">Tipo</th>
                <th className="px-4 py-3 text-left font-medium">
                  Última manutenção
                </th>
                <th className="px-4 py-3 text-left font-medium">Patrimônio</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-muted-foreground"
                  >
                    Carregando maquinários...
                  </td>
                </tr>
              )}

              {!isLoading && (!maquinarios || maquinarios.length === 0) && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-muted-foreground"
                  >
                    Nenhum maquinário cadastrado ainda.
                  </td>
                </tr>
              )}

              {!isLoading &&
                maquinarios?.map((maquinario) => (
                  <tr
                    key={maquinario.id}
                    className="cursor-pointer border-t border-border/30 transition-colors hover:bg-white/5 focus-within:bg-white/5"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {maquinario.modelo}
                    </td>
                    <td className="px-4 py-3 text-foreground/80">
                      {maquinario.ano_fabricacao}
                    </td>
                    <td className="px-4 py-3 text-foreground/80">
                      {currencyFormatter.format(Number(maquinario.custo))}
                    </td>
                    <td className="px-4 py-3 capitalize text-foreground/80">
                      {maquinario.tipo_custo}
                    </td>
                    <td className="px-4 py-3 text-foreground/80">
                      {new Date(
                        maquinario.ultima_manutencao
                      ).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                          maquinario.alugado
                            ? 'bg-amber-500/20 text-amber-200'
                            : 'bg-emerald-500/20 text-emerald-200'
                        }`}
                      >
                        {maquinario.alugado ? 'Alugado' : 'Próprio'}
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
              Carregando maquinários...
            </p>
          )}

          {!isLoading && (!maquinarios || maquinarios.length === 0) && (
            <p className="text-center text-sm text-muted-foreground">
              Nenhum maquinário cadastrado ainda.
            </p>
          )}

          {!isLoading &&
            maquinarios?.map((maquinario) => (
              <button
                key={`card-${maquinario.id}`}
                type="button"
                className="w-full rounded-lg border border-border/40 bg-black/10 p-4 text-left shadow-inner shadow-black/10 transition-colors hover:bg-white/5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {maquinario.modelo}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Ano {maquinario.ano_fabricacao}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                      maquinario.alugado
                        ? 'bg-amber-500/20 text-amber-200'
                        : 'bg-emerald-500/20 text-emerald-200'
                    }`}
                  >
                    {maquinario.alugado ? 'Alugado' : 'Próprio'}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-foreground/80">
                  <div>
                    <p className="text-muted-foreground">Custo</p>
                    <p className="font-semibold flex flex-wrap items-baseline gap-1">
                      {currencyFormatter.format(Number(maquinario.custo))}
                      <span className="text-xs uppercase text-muted-foreground">
                        · {maquinario.tipo_custo?.toUpperCase()}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Última manutenção</p>
                    <p className="font-semibold">
                      {new Date(
                        maquinario.ultima_manutencao
                      ).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </button>
            ))}
        </div>
      </div>
    </>
  )
}
