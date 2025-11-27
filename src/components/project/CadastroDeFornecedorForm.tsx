'use client'

import { FormEvent, useContext, useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { SessionContext } from '@/app/proprietario/SessionProvider'
import { Toast } from '../ui/toast'
import DialogConfirmaDelecao from './DialogConfirmaDelecao'
import { useMask } from '@react-input/mask'
import {
  atualizarFornecedorPorId,
  buscarFornecedorPorIdEPropriedade,
  criarFornecedor,
  deletarFornecedor,
  IFornecedorResponse,
} from '@/app/frontend/use-cases/FornecedorCases'

export default function CadastroDeFornecedorForm({
  idFornecedor,
}: {
  idFornecedor?: string
}) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [toast, setToast] = useState<{
    title: string
    description?: string
    variant: 'default' | 'success' | 'error'
  } | null>(null)
  const deleteDialogRef = useRef<HTMLDialogElement>(null)
  const telefoneMask = useMask({
    mask: '(__)_____-____',
    replacement: { _: /\d/ },
  })

  const session = useContext(SessionContext)
  const idPropriedadeSelecionada = session.propriedadeSelecionadaId

  useEffect(() => {
    if (!idFornecedor || !idPropriedadeSelecionada) return

    buscarFornecedorPorIdEPropriedade(
      idFornecedor,
      idPropriedadeSelecionada
    ).then((data) => {
      const fornecedor = data?.data.dataConnection
      if (!fornecedor) return
      setNome(fornecedor.nome ?? '')
      setEmail(fornecedor.email ?? '')
      setTelefone(fornecedor.telefone ?? '')
      if (telefoneMask.current) {
        telefoneMask.current.value = fornecedor.telefone ?? ''
      }
    })
  }, [idFornecedor, idPropriedadeSelecionada, telefoneMask])

  async function salvar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const nome = formData.get('nome') as string
    const email = formData.get('email') as string
    const telefone = formData.get('telefone') as string

    try {
      let resultado: IFornecedorResponse | undefined
      if (idFornecedor) {
        resultado = await atualizarFornecedorPorId(
          idFornecedor,
          nome,
          email,
          telefone,
          idPropriedadeSelecionada ?? 0
        )
      } else {
        resultado = await criarFornecedor(
          nome,
          email,
          telefone,
          idPropriedadeSelecionada ?? 0
        )
      }

      if (resultado && resultado.success) {
        setToast({
          title: idFornecedor
            ? 'Fornecedor atualizado!'
            : 'Fornecedor criado!',
          description: `${nome} foi ${
            idFornecedor ? 'atualizado' : 'cadastrado'
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
    if (!idFornecedor) {
      setToast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar os dados. Tente novamente.',
        variant: 'error',
      })
      return
    }

    try {
      const resultado = await deletarFornecedor(idFornecedor)
      if (resultado && resultado.success) {
        setToast({
          title: 'Fornecedor excluído!',
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
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                defaultValue={email}
              />
            </div>
            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                type="text"
                id="telefone"
                name="telefone"
                ref={telefoneMask}
                defaultValue={telefone}
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
        temCerteza="Tem certeza que deseja excluir o fornecedor?"
        estaAcao="Esta ação não pode ser desfeita e significa excluir o recurso do histórico de tarefas"
      />
    </>
  )
}
