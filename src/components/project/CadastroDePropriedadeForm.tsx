'use client'

import { FormEvent, useContext, useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { SessionContext } from '@/app/proprietario/SessionProvider'
import { Toast } from '../ui/toast'
import DialogConfirmaDelecao from './DialogConfirmaDelecao'
import { useMask } from '@react-input/mask'
import { outFormatCNPJ, validarCNPJ } from '@/app/frontend/lib/tools'
import {
  atualizarPropriedadePorId,
  buscarPropriedadePorIdEProprietario,
  criarPropriedade,
  deletarPropriedade,
  IPropriedadeResponse,
} from '@/app/frontend/use-cases/PropriedadeCases'

export default function CadastroDePropriedadeForm({
  idPropriedade,
}: {
  idPropriedade?: string
}) {
  const [endereco, setEndereco] = useState('')
  const [gerente, setGerente] = useState('')
  const [cnpj, setCnpj] = useState('')

  const [toast, setToast] = useState<{
    title: string
    description?: string
    variant: 'default' | 'success' | 'error'
  } | null>(null)
  const deleteDialogRef = useRef<HTMLDialogElement>(null)
  const cnpjMask = useMask({
    mask: '__.___.___/____-__',
    replacement: { _: /\d/ },
  })

  const session = useContext(SessionContext)
  const idProprietario = session.idProprietario

  useEffect(() => {
    if (!idPropriedade || !idProprietario) return

    buscarPropriedadePorIdEProprietario(idPropriedade, idProprietario).then(
      (data) => {
        const prop = data?.data.dataConnection
        if (!prop) return
        setEndereco(prop.endereco ?? '')
        setGerente(prop.gerente ?? '')
        setCnpj(prop.cnpj ?? '')
        if (prop.cnpj && cnpjMask.current) {
          cnpjMask.current.value = outFormatCNPJ(prop.cnpj)
        }
      }
    )
  }, [idPropriedade, idProprietario, cnpjMask])

  async function salvar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const endereco = formData.get('endereco') as string
    const gerente = (formData.get('gerente') as string) || undefined
    const cnpj = (formData.get('cnpj') as string) || undefined

    if (cnpj && !validarCNPJ(cnpj)) {
      setToast({
        title: 'Dados inválidos',
        description: 'CNPJ informado é inválido. Verifique e tente novamente.',
        variant: 'error',
      })
      return
    }

    try {
      let resultado: IPropriedadeResponse | undefined
      if (idPropriedade) {
        resultado = await atualizarPropriedadePorId(
          idPropriedade,
          endereco,
          gerente,
          cnpj,
          idProprietario ?? 0
        )
      } else {
        resultado = await criarPropriedade(
          endereco,
          gerente,
          cnpj,
          idProprietario ?? 0
        )
      }

      if (resultado && resultado.success) {
        setToast({
          title: idPropriedade ? 'Propriedade atualizada!' : 'Propriedade criada!',
          description: `${endereco} foi ${
            idPropriedade ? 'atualizada' : 'cadastrada'
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
    if (!idPropriedade) {
      setToast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar os dados. Tente novamente.',
        variant: 'error',
      })
      return
    }

    try {
      const resultado = await deletarPropriedade(idPropriedade)
      if (resultado && resultado.success) {
        setToast({
          title: 'Propriedade excluída!',
          description: `${endereco} foi excluída com sucesso.`,
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
              <Label htmlFor="endereco">Endereço *</Label>
              <Input
                type="text"
                id="endereco"
                name="endereco"
                defaultValue={endereco}
                required
              />
            </div>
            <div>
              <Label htmlFor="gerente">Gerente</Label>
              <Input
                type="text"
                id="gerente"
                name="gerente"
                defaultValue={gerente}
              />
            </div>
            <div>
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                type="text"
                id="cnpj"
                name="cnpj"
                ref={cnpjMask}
                defaultValue={cnpj}
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
        temCerteza="Tem certeza que deseja excluir a propriedade?"
        estaAcao="Esta ação não pode ser desfeita e significa excluir o recurso do histórico de tarefas"
      />
    </>
  )
}
