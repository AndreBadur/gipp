'use client'

import { IProduto } from '@/app/backend/services/ProdutoService'
import { buscarTodosProdutos } from '@/app/frontend/use-cases/ProdutoCases'
import { SessionContext } from '@/app/proprietario/SessionProvider'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import CadastroDeProdutoForm from './CadastroDeProdutoForm'
import { Button } from '../ui/button'

export default function ProdutosTable() {
  const session = useContext(SessionContext)
  const { propriedadeSelecionadaId } = session
  const [produtos, setProdutos] = useState<IProduto[] | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProdutoId, setSelectedProdutoId] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const editDialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (!propriedadeSelecionadaId) return
    setIsLoading(true)
    buscarTodosProdutos(propriedadeSelecionadaId)
      .then((data) => {
        setProdutos(data?.data.dataConnection ?? [])
      })
      .finally(() => setIsLoading(false))
  }, [propriedadeSelecionadaId])

  function handleRowClick(id?: number) {
    if (!id) return
    setSelectedProdutoId(String(id))
    setIsDialogOpen(true)
    editDialogRef.current?.showModal()
  }

  function openCreateDialog() {
    setSelectedProdutoId(null)
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
          <h2 className="text-base font-semibold text-foreground">Produtos</h2>
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
                <th className="px-4 py-3 text-left font-medium">Quantidade</th>
                <th className="px-4 py-3 text-left font-medium">Custo</th>
                <th className="px-4 py-3 text-left font-medium">
                  Preço de Venda
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
                    Carregando produtos...
                  </td>
                </tr>
              )}

              {!isLoading && (!produtos || produtos.length === 0) && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-muted-foreground"
                  >
                    Nenhum produto cadastrado ainda.
                  </td>
                </tr>
              )}

              {!isLoading &&
                produtos?.map((produto) => (
                  <tr
                    key={produto.id}
                    className="cursor-pointer border-t border-border/30 transition-colors hover:bg-white/5 focus-within:bg-white/5"
                    onClick={() => handleRowClick(produto.id)}
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {produto.nome}
                    </td>
                    <td className="px-4 py-3 text-foreground/80">
                      {produto.quantidade ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-foreground/80">
                      {produto.custo
                        ? currencyFormatter.format(Number(produto.custo))
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-foreground/80">
                      {produto.preco_venda
                        ? currencyFormatter.format(Number(produto.preco_venda))
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
              Carregando produtos...
            </p>
          )}

          {!isLoading && (!produtos || produtos.length === 0) && (
            <p className="text-center text-sm text-muted-foreground">
              Nenhum produto cadastrado ainda.
            </p>
          )}

          {!isLoading &&
            produtos?.map((produto) => (
              <button
                key={`card-${produto.id}`}
                type="button"
                onClick={() => handleRowClick(produto.id)}
                className="w-full rounded-lg border border-border/40 bg-black/10 p-4 text-left shadow-inner shadow-black/10 transition-colors hover:bg-white/5"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">
                    {produto.nome}
                  </p>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-foreground">
                    {produto.quantidade ?? '—'}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-foreground/80">
                  <div>
                    <p className="text-muted-foreground">Custo</p>
                    <p className="font-semibold">
                      {produto.custo
                        ? currencyFormatter.format(Number(produto.custo))
                        : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Preço</p>
                    <p className="font-semibold">
                      {produto.preco_venda
                        ? currencyFormatter.format(Number(produto.preco_venda))
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
          <CadastroDeProdutoForm
            key={selectedProdutoId ?? 'novo-produto'}
            idProduto={selectedProdutoId ?? undefined}
          />
        )}
      </dialog>
    </>
  )
}
