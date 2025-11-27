'use client'

import { FormEvent, useContext, useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { SessionContext } from '@/app/proprietario/SessionProvider'
import { Toast } from '../ui/toast'
import DialogConfirmaDelecao from './DialogConfirmaDelecao'
import {
  atualizarProdutoPorId,
  buscarProdutoPorIdEPropriedade,
  criarProduto,
  deletarProduto,
  IProdutoResponse,
} from '@/app/frontend/use-cases/ProdutoCases'

export default function CadastroDeProdutoForm({
  idProduto,
}: {
  idProduto?: string
}) {
  const [nome, setNome] = useState('')
  const [quantidade, setQuantidade] = useState<number>(0)
  const [custo, setCusto] = useState<number>(0)
  const [precoVenda, setPrecoVenda] = useState<number>(0)

  const [toast, setToast] = useState<{
    title: string
    description?: string
    variant: 'default' | 'success' | 'error'
  } | null>(null)
  const deleteDialogRef = useRef<HTMLDialogElement>(null)

  const session = useContext(SessionContext)
  const idPropriedadeSelecionada = session.propriedadeSelecionadaId

  useEffect(() => {
    if (!idProduto || !idPropriedadeSelecionada) return

    buscarProdutoPorIdEPropriedade(idProduto, idPropriedadeSelecionada).then(
      (data) => {
        const produto = data?.data.dataConnection
        if (!produto) return
        setNome(produto.nome ?? '')
        setQuantidade(Number(produto.quantidade ?? 0))
        setCusto(Number(produto.custo ?? 0))
        setPrecoVenda(Number(produto.preco_venda ?? 0))
      }
    )
  }, [idProduto, idPropriedadeSelecionada])

  async function salvar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const nome = formData.get('nome') as string
    const quantidade = Number(formData.get('quantidade') ?? 0)
    const custo = Number(formData.get('custo') ?? 0)
    const preco_venda = Number(formData.get('preco_venda') ?? 0)

    try {
      let resultado: IProdutoResponse | undefined
      if (idProduto) {
        resultado = await atualizarProdutoPorId(
          idProduto,
          nome,
          quantidade,
          custo,
          preco_venda,
          idPropriedadeSelecionada ?? 0
        )
      } else {
        resultado = await criarProduto(
          nome,
          quantidade,
          custo,
          preco_venda,
          idPropriedadeSelecionada ?? 0
        )
      }

      if (resultado && resultado.success) {
        setToast({
          title: idProduto ? 'Produto atualizado!' : 'Produto criado!',
          description: `${nome} foi ${
            idProduto ? 'atualizado' : 'cadastrado'
          } com sucesso.`,
          variant: 'success',
        })
        window.location.reload()
      } else {
        setToast({
          title: 'Erro ao salvar',
          description: 'Não foi possível salvar os dados. Tente novamente.',
          variant: 'error',
        })
      }
    } catch (error) {
      console.error(error)
      setToast({
        title: 'Erro inesperado',
        description: 'Ocorreu um erro ao processar sua solicitação.',
        variant: 'error',
      })
    }
  }

  async function resultadoDelecao() {
    if (!idProduto) {
      setToast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar os dados. Tente novamente.',
        variant: 'error',
      })
      return
    }

    try {
      const resultado = await deletarProduto(idProduto)
      if (resultado && resultado.success) {
        setToast({
          title: 'Produto excluído!',
          description: `${nome} foi excluído com sucesso.`,
          variant: 'success',
        })
        window.location.reload()
      } else {
        setToast({
          title: 'Erro ao salvar',
          description: 'Não foi possível salvar os dados. Tente novamente.',
          variant: 'error',
        })
      }
    } catch (error) {
      console.error(error)
      setToast({
        title: 'Erro inesperado',
        description: 'Ocorreu um erro ao processar sua solicitação.',
        variant: 'error',
      })
    }
  }

  return (
    <>
      {toast && (
        <Toast
          title={toast.title}
          description={toast.description}
          variant={toast.variant}
          onClose={() => setToast(null)}
        />
      )}

      <form
        className="h-auto w-full rounded-lg bg-secondary-background p-1"
        onSubmit={salvar}
      >
        <div className="w-full">
          <div className="grid h-full gap-1 px-3.5 pb-2">
            <div>
              <Label htmlFor="nome">Nome *</Label>
              <Input
                type="text"
                id="nome"
                name="nome"
                defaultValue={nome}
                required
              />
            </div>
            <div>
              <Label htmlFor="quantidade">Quantidade</Label>
              <Input
                type="number"
                step="0.01"
                min={0}
                id="quantidade"
                name="quantidade"
                value={quantidade}
                onChange={(event) => setQuantidade(Number(event.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="custo">Custo</Label>
              <Input
                type="number"
                step="0.01"
                min={0}
                id="custo"
                name="custo"
                value={custo}
                onChange={(event) => setCusto(Number(event.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="preco_venda">Preço de venda</Label>
              <Input
                type="number"
                step="0.01"
                min={0}
                id="preco_venda"
                name="preco_venda"
                value={precoVenda}
                onChange={(event) => setPrecoVenda(Number(event.target.value))}
              />
            </div>

            <div className="mt-2 flex h-auto w-full flex-row items-center justify-between">
              <Button
                type="button"
                variant="destructive"
                onClick={(e) => {
                  const dialog = e.currentTarget.closest(
                    'dialog'
                  ) as HTMLDialogElement
                  dialog?.close()
                }}
              >
                <p className="font-semibold">CANCELAR</p>
              </Button>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="delete"
                  size="icon"
                  onClick={() => {
                    deleteDialogRef.current?.showModal()
                  }}
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </Button>
                <Button
                  type="submit"
                  variant="confirm"
                  className="min-w-[120px]"
                >
                  <p className="font-semibold">SALVAR</p>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
      <DialogConfirmaDelecao
        dialogRef={deleteDialogRef}
        onConfirm={async () => {
          await resultadoDelecao()
        }}
        temCerteza="Tem certeza que deseja excluir o produto?"
        estaAcao="Esta ação não pode ser desfeita e significa excluir o recurso do histórico de tarefas"
      />
    </>
  )
}
