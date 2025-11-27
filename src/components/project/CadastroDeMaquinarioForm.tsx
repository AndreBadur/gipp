'use client'

import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { FormEvent, useContext, useEffect, useRef, useState } from 'react'
import { Checkbox } from '../ui/checkbox'
import { SessionContext } from '@/app/proprietario/SessionProvider'
import { Toast } from '../ui/toast'
import DialogConfirmaDelecao from './DialogConfirmaDelecao'
import { tipo_custo } from '@/generated/prisma'
import {
  atualizarMaquinarioPorId,
  buscarMaquinarioPorIdEProprietario,
  criarMaquinario,
  deletarMaquinario,
  IMaquinarioResponse,
} from '@/app/frontend/use-cases/MaquinarioCases'

export default function CadastroDeMaquinarioForm({
  idMaquinario,
}: {
  idMaquinario?: string
}) {
  const [modelo, setModelo] = useState<string>('')
  const [anoFabricacao, setAnoFabricacao] = useState<number>()
  const [custo, setCusto] = useState<number>()
  const [tipoCusto, setTipoCusto] = useState<tipo_custo>()
  const [ultimaManutencao, setUltimaManutencao] = useState<Date>(new Date())
  const [alugado, setAlugado] = useState<boolean>(false)
  const [propriedade, setPropriedade] = useState<number>()
  const [ultimaManutencaoValue, setUltimaManutencaoValue] = useState('')
  const [toast, setToast] = useState<{
    title: string
    description?: string
    variant: 'default' | 'success' | 'error'
  } | null>(null)
  const deleteDialogRef = useRef<HTMLDialogElement>(null)

  const session = useContext(SessionContext)
  const idProprietario = session.idProprietario
  const propriedades = session.propriedades
  const propriedadeSelecionadaId = session.propriedadeSelecionadaId

  useEffect(() => {
    if (idMaquinario) {
      buscarMaquinarioPorIdEProprietario(
        idMaquinario,
        idProprietario ?? 0
      ).then((data) => {
        setModelo(data?.data.dataConnection?.modelo ?? '')
        setAnoFabricacao(data?.data.dataConnection?.ano_fabricacao)
        setCusto(data?.data.dataConnection.custo)
        setTipoCusto(data?.data.dataConnection.tipo_custo)
        setUltimaManutencao(
          data?.data.dataConnection?.ultima_manutencao ?? new Date()
        )
        setAlugado(data?.data.dataConnection?.alugado ?? false)
        setPropriedade(
          data?.data.dataConnection?.id_propriedade ??
            propriedadeSelecionadaId ??
            undefined
        )
      })
    }
  }, [session, idMaquinario, idProprietario, propriedadeSelecionadaId])

  useEffect(() => {
    if (propriedade || propriedades.length === 0) return
    setPropriedade(propriedadeSelecionadaId ?? propriedades[0]?.id)
  }, [propriedade, propriedades, propriedadeSelecionadaId])

  useEffect(() => {
    if (ultimaManutencao) {
      const formatada = new Date(ultimaManutencao).toISOString().split('T')[0]
      setUltimaManutencaoValue(formatada)
    }
  }, [ultimaManutencao])

  async function salvar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const modelo = formData.get('modelo') as string
    const anoFabricacao = formData.get('anoFabricacao') as string
    const custo = formData.get('custo') as string
    const tipoCusto = formData.get('tipoCusto') as tipo_custo
    const ultimaManutencao = formData.get('ultimaManutencao') as string

    let alugado: boolean = false
    const checkboxAlugado = formData.get('alugado') as string
    if (checkboxAlugado !== null) {
      alugado = true
    }

    try {
      let resultado: IMaquinarioResponse | undefined
      if (idMaquinario) {
        resultado = await atualizarMaquinarioPorId(
          idMaquinario,
          modelo,
          Number(anoFabricacao),
          Number(custo),
          tipoCusto,
          new Date(ultimaManutencao),
          alugado,
          idProprietario ?? 0,
          propriedade ?? 0
        )
        window.location.reload()
      } else {
        resultado = await criarMaquinario(
          modelo,
          Number(anoFabricacao),
          Number(custo),
          tipoCusto,
          new Date(ultimaManutencao),
          alugado,
          idProprietario ?? 0,
          propriedade ?? 0
        )
        window.location.reload()
      }

      if (resultado && resultado.success) {
        setToast({
          title: idMaquinario ? 'Maquinário atualizado!' : 'Maquinário criado!',
          description: `${modelo} foi ${
            idMaquinario ? 'atualizado' : 'cadastrado'
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

  async function resultadoDeleçao() {
    if (idMaquinario) {
      try {
        const resultado = await deletarMaquinario(idMaquinario)

        if (resultado && resultado.success) {
          setToast({
            title: 'Maquinário excluido!',
            description: `${modelo} foi excluído com sucesso.`,
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
    } else {
      setToast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar os dados. Tente novamente.',
        variant: 'error',
      })
    }
  }

  async function validarPatrimonio() {
    if (alugado === true) {
      setAlugado(false)
    } else {
      setAlugado(true)
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
        className={`bg-secondary-background h-auto w-full p-1 rounded-lg`}
        onSubmit={salvar}
      >
        <div className={`w-full h-auto`}>
          <div className="grid h-full gap-1 px-3.5 pb-2">
            <div>
              <Label htmlFor="modelo">Modelo *</Label>
              <Input
                type="text"
                id="modelo"
                name="modelo"
                defaultValue={modelo}
                required
              />
            </div>
            <div>
              <Label htmlFor="anoFabricacao">Ano de Fabricação</Label>
              <Input
                type="text"
                id="anoFabricacao"
                name="anoFabricacao"
                defaultValue={anoFabricacao}
              />
            </div>
            <div>
              <Label htmlFor="custo">Custo *</Label>
              <Input
                type="text"
                id="custo"
                name="custo"
                defaultValue={custo}
                required
              />
            </div>
            <div>
              <Label htmlFor="tipoCusto">Tipo de Custo *</Label>
              <select
                id="tipoCusto"
                name="tipoCusto"
                className="flex h-10 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base text-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                value={tipoCusto ?? ''}
                required
                onChange={(event) =>
                  setTipoCusto(event.target.value as tipo_custo)
                }
              >
                <option value="" disabled hidden>
                  Selecione uma opção
                </option>
                <option value="hora">Hora</option>
                <option value="diario">Diário</option>
                <option value="mensal">Mensal</option>
              </select>
            </div>
            <div>
              <Label htmlFor="ultimaManutencao">Ultima Manutenção</Label>
              <Input
                type="date"
                id="ultimaManutencao"
                name="ultimaManutencao"
                value={ultimaManutencaoValue}
                onChange={(e) => setUltimaManutencaoValue(e.target.value)}
              />
            </div>
            <div>
              <div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="alugado"
                    name="alugado"
                    value={'true'}
                    checked={alugado}
                    onCheckedChange={validarPatrimonio}
                  />
                  <Label className={'m-2'} htmlFor="alugado">
                    Maquinário Alugado
                  </Label>
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="propriedade">Propriedade *</Label>
              <select
                id="propriedade"
                name="propriedade"
                className="flex h-10 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base text-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                value={propriedade ?? ''}
                onChange={(event) =>
                  setPropriedade(Number(event.target.value) || undefined)
                }
                required
              >
                <option value="" disabled hidden>
                  Selecione uma propriedade
                </option>
                {propriedades.map((prop) =>
                  prop.id ? (
                    <option key={prop.id} value={prop.id}>
                      {prop.endereco}
                    </option>
                  ) : null
                )}
              </select>
            </div>
            <div className="flex flex-row justify-between items-center h-auto mt-2 w-full">
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
          await resultadoDeleçao()
        }}
        temCerteza="Tem certeza que deseja excluir o maquinário?"
        estaAcao="Esta ação não pode ser desfeita e significa excluir o recurso do histórico de tarefas"
      />
    </>
  )
}
