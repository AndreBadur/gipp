'use client'

import { FormEvent, useContext, useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { SessionContext } from '@/app/proprietario/SessionProvider'
import { Toast } from '../ui/toast'
import DialogConfirmaDelecao from './DialogConfirmaDelecao'
import {
  atualizarCentroCustoPorId,
  buscarCentroCustoPorIdEPropriedade,
  criarCentroCusto,
  deletarCentroCusto,
  ICentroCustoResponse,
} from '@/app/frontend/use-cases/CentroCustoCases'

export default function CadastroDeCentroCustoForm({
  idCentroCusto,
}: {
  idCentroCusto?: string
}) {
  const [nome, setNome] = useState('')
  const [toast, setToast] = useState<{
    title: string
    description?: string
    variant: 'default' | 'success' | 'error'
  } | null>(null)
  const deleteDialogRef = useRef<HTMLDialogElement>(null)

  const session = useContext(SessionContext)
  const idPropriedadeSelecionada = session.propriedadeSelecionadaId

  useEffect(() => {
    if (!idCentroCusto || !idPropriedadeSelecionada) return

    buscarCentroCustoPorIdEPropriedade(
      idCentroCusto,
      idPropriedadeSelecionada
    ).then((data) => {
      const centro = data?.data.dataConnection
      if (!centro) return
      setNome(centro.nome ?? '')
    })
  }, [idCentroCusto, idPropriedadeSelecionada])

  async function salvar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const nome = formData.get('nome') as string

    try {
      let resultado: ICentroCustoResponse | undefined
      if (idCentroCusto) {
        resultado = await atualizarCentroCustoPorId(
          idCentroCusto,
          nome,
          idPropriedadeSelecionada ?? 0
        )
      } else {
        resultado = await criarCentroCusto(nome, idPropriedadeSelecionada ?? 0)
      }

      if (resultado && resultado.success) {
        setToast({
          title: idCentroCusto
            ? 'Centro de custo atualizado!'
            : 'Centro de custo criado!',
          description: `${nome} foi ${
            idCentroCusto ? 'atualizado' : 'cadastrado'
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
    if (!idCentroCusto) {
      setToast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar os dados. Tente novamente.',
        variant: 'error',
      })
      return
    }

    try {
      const resultado = await deletarCentroCusto(idCentroCusto)
      if (resultado && resultado.success) {
        setToast({
          title: 'Centro de custo excluído!',
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
                <Button type="submit" variant="confirm" className="min-w-[120px]">
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
        temCerteza="Tem certeza que deseja excluir o centro de custo?"
        estaAcao="Esta ação não pode ser desfeita e significa excluir o recurso do histórico de tarefas"
      />
    </>
  )
}
