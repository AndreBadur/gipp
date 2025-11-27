'use client'

import { FormEvent, useContext, useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { SessionContext } from '@/app/proprietario/SessionProvider'
import { Toast } from '../ui/toast'
import DialogConfirmaDelecao from './DialogConfirmaDelecao'
import {
  buscarLancamentoPorIdEPropriedade,
  criarLancamento,
  deletarLancamento,
} from '@/app/frontend/use-cases/LancamentoCases'
import {
  buscarTodosCentrosDeCusto,
  IListaCentroCustosResponse,
} from '@/app/frontend/use-cases/CentroCustoCases'
import { ILancamento } from '@/app/backend/services/LancamentoService'

export default function CadastroDeLancamentoForm({
  idLancamento,
}: {
  idLancamento?: string
}) {
  const [valor, setValor] = useState<number>(0)
  const [tipoLancamento, setTipoLancamento] =
    useState<ILancamento['tipo_lancamento']>('entrada')
  const [dataLancamento, setDataLancamento] = useState<string>('')
  const [centroCustoId, setCentroCustoId] = useState<number | ''>('')
  const [centros, setCentros] = useState<
    IListaCentroCustosResponse | undefined
  >(undefined)

  const [toast, setToast] = useState<{
    title: string
    description?: string
    variant: 'default' | 'success' | 'error'
  } | null>(null)
  const deleteDialogRef = useRef<HTMLDialogElement>(null)

  const session = useContext(SessionContext)
  const idPropriedade = session.propriedadeSelecionadaId

  useEffect(() => {
    if (!idPropriedade) return
    buscarTodosCentrosDeCusto(idPropriedade).then((data) => setCentros(data))
  }, [idPropriedade])

  useEffect(() => {
    if (!idLancamento || !idPropriedade) return
    buscarLancamentoPorIdEPropriedade(idLancamento, idPropriedade).then(
      (data) => {
        const lanc = data?.data.dataConnection
        if (!lanc) return
        setValor(Number(lanc.valor ?? 0))
        setTipoLancamento(lanc.tipo_lancamento)
        setDataLancamento(
          lanc.data_lancamento
            ? new Date(lanc.data_lancamento).toISOString().split('T')[0]
            : ''
        )
        setCentroCustoId(lanc.id_centro_custo ?? '')
      }
    )
  }, [idLancamento, idPropriedade])

  async function salvar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const valor = Number(formData.get('valor') ?? 0)
    const tipo_lancamento = formData.get(
      'tipo_lancamento'
    ) as ILancamento['tipo_lancamento']
    const data_lancamento = formData.get('data_lancamento') as string
    const centroIdForm = formData.get('centro_custo')
    const centroSelecionado = centroIdForm
      ? Number(centroIdForm)
      : centroCustoId === ''
      ? undefined
      : Number(centroCustoId)

    try {
      const resultado = await criarLancamento(
        valor,
        tipo_lancamento,
        data_lancamento ? new Date(data_lancamento) : undefined,
        idPropriedade ?? 0,
        centroSelecionado
      )

      if (resultado && resultado.success) {
        setToast({
          title: idLancamento ? 'Lançamento atualizado!' : 'Lançamento criado!',
          description: 'Operação realizada com sucesso.',
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
    if (!idLancamento) {
      setToast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar os dados. Tente novamente.',
        variant: 'error',
      })
      return
    }

    try {
      const resultado = await deletarLancamento(idLancamento)
      if (resultado && resultado.success) {
        setToast({
          title: 'Lançamento excluído!',
          description: 'Registro removido com sucesso.',
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
              <Label htmlFor="valor">Valor *</Label>
              <Input
                type="number"
                step="0.01"
                min={0}
                id="valor"
                name="valor"
                value={valor}
                onChange={(event) => setValor(Number(event.target.value))}
                required
              />
            </div>
            <div>
              <Label htmlFor="tipo_lancamento">Tipo *</Label>
              <select
                id="tipo_lancamento"
                name="tipo_lancamento"
                className="flex h-10 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base text-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                value={tipoLancamento}
                onChange={(event) =>
                  setTipoLancamento(
                    event.target.value as ILancamento['tipo_lancamento']
                  )
                }
                required
              >
                <option value="" disabled hidden>
                  Selecione uma opção
                </option>
                <option value="entrada">Entrada</option>
                <option value="saida">Saída</option>
              </select>
            </div>
            <div>
              <Label htmlFor="data_lancamento">Data</Label>
              <Input
                type="date"
                id="data_lancamento"
                name="data_lancamento"
                defaultValue={dataLancamento}
                onChange={(event) => setDataLancamento(event.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="centro_custo">Centro de custo</Label>
              <select
                id="centro_custo"
                name="centro_custo"
                className="flex h-10 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base text-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                value={centroCustoId}
                onChange={(event) =>
                  setCentroCustoId(
                    event.target.value ? Number(event.target.value) : ''
                  )
                }
              >
                <option value="">Selecione</option>
                {centros?.data.dataConnection.map((centro) =>
                  centro.id ? (
                    <option key={centro.id} value={centro.id}>
                      {centro.nome}
                    </option>
                  ) : null
                )}
              </select>
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
                  disabled={idLancamento !== undefined}
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
        temCerteza="Tem certeza que deseja excluir o lançamento?"
        estaAcao="Esta ação não pode ser desfeita e significa excluir o recurso do histórico de tarefas"
      />
    </>
  )
}
