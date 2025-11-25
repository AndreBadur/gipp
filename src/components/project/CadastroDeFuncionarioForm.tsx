'use client'

import { FormEvent, useContext, useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { SessionContext } from '@/app/proprietario/SessionProvider'
import { Toast } from '../ui/toast'
import DialogConfirmaDelecao from './DialogConfirmaDelecao'
import { tipo_custo_funcionario } from '@/generated/prisma'
import {
  atualizarFuncionarioPorId,
  buscarFuncionarioPorIdEProprietario,
  criarFuncionario,
  deletarFuncionarioPorId,
  IFuncionarioResponse,
} from '@/app/frontend/use-cases/FuncionarioCases'

export default function CadastroDeFuncionarioForm({
  idFuncionario,
}: {
  idFuncionario?: string
}) {
  const [nome, setNome] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [cpf, setCpf] = useState<string>('')
  const [dataNascimento, setDataNascimento] = useState<string>('')
  const [cargo, setCargo] = useState<string>('')
  const [contaBancaria, setContaBancaria] = useState<string>('')
  const [custo, setCusto] = useState<number>()
  const [tipoCusto, setTipoCusto] = useState<tipo_custo_funcionario>()
  const [propriedade, setPropriedade] = useState<number>()

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
    if (!idFuncionario) return

    buscarFuncionarioPorIdEProprietario(
      idFuncionario,
      idProprietario ?? 0
    ).then((data) => {
      const funcionario = data?.data.dataConnection
      if (!funcionario) return
      setNome(funcionario.nome ?? '')
      setEmail(funcionario.email ?? '')
      setCpf(funcionario.cpf ?? '')
      setDataNascimento(
        funcionario.data_nascimento
          ? new Date(funcionario.data_nascimento).toISOString().split('T')[0]
          : ''
      )
      setCargo(funcionario.cargo)
      setCusto(funcionario.custo ?? 0)
      setTipoCusto(funcionario.tipo_custo ?? undefined)
      setContaBancaria(funcionario.conta_bancaria ?? '')
      setPropriedade(
        funcionario.id_propriedade ?? propriedadeSelecionadaId ?? undefined
      )
    })
  }, [idFuncionario, idProprietario, propriedadeSelecionadaId])

  useEffect(() => {
    if (propriedade || propriedades.length === 0) return
    setPropriedade(propriedadeSelecionadaId ?? propriedades[0]?.id)
  }, [propriedade, propriedades, propriedadeSelecionadaId])

  async function salvar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const nome = formData.get('nome') as string
    const email = formData.get('email') as string
    const cpf = formData.get('cpf') as string
    const cargo = formData.get('cargo') as string
    const data_nascimento = formData.get('data_nascimento') as string
    const conta_bancaria = formData.get('conta_bancaria') as string
    const custo = Number(formData.get('custo') ?? 0)
    const tipo_custo = formData.get('tipo_custo') as tipo_custo_funcionario

    try {
      let resultado: IFuncionarioResponse | undefined
      if (idFuncionario) {
        resultado = await atualizarFuncionarioPorId(
          idFuncionario,
          nome,
          email,
          cpf,
          new Date(data_nascimento),
          cargo,
          custo,
          tipo_custo,
          conta_bancaria,
          idProprietario ?? 0,
          propriedade ?? 0
        )
      } else {
        resultado = await criarFuncionario(
          nome,
          email,
          cpf,
          new Date(data_nascimento),
          cargo,
          custo,
          tipo_custo,
          conta_bancaria,
          idProprietario ?? 0,
          propriedade ?? 0
        )
      }

      if (resultado && resultado.success) {
        setToast({
          title: idFuncionario
            ? 'Funcionário atualizado!'
            : 'Funcionário criado!',
          description: `${nome} foi ${
            idFuncionario ? 'atualizado' : 'cadastrado'
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
    if (!idFuncionario) {
      setToast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar os dados. Tente novamente.',
        variant: 'error',
      })
      return
    }

    try {
      const resultado = await deletarFuncionarioPorId(idFuncionario)
      if (resultado && resultado.success) {
        setToast({
          title: 'Funcionário excluído!',
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
              <Label htmlFor="cpf">CPF *</Label>
              <Input
                type="text"
                id="cpf"
                name="cpf"
                defaultValue={cpf}
                required
              />
            </div>
            <div>
              <Label htmlFor="data_nascimento">Data de nascimento</Label>
              <Input
                type="date"
                id="data_nascimento"
                name="data_nascimento"
                defaultValue={dataNascimento}
                onChange={(event) => setDataNascimento(event.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="conta_bancaria">Cargo</Label>
              <Input type="text" id="cargo" name="cargo" defaultValue={cargo} />
            </div>
            <div>
              <Label htmlFor="custo">Custo</Label>
              <Input
                type="number"
                step="0.01"
                id="custo"
                name="custo"
                defaultValue={custo}
                min={0}
                onChange={(event) => setCusto(Number(event.target.value))}
                required
              />
            </div>
            <div>
              <Label htmlFor="tipo_custo">Tipo de custo</Label>
              <select
                id="tipo_custo"
                name="tipo_custo"
                className="flex h-10 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base text-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                value={tipoCusto ?? ''}
                onChange={(event) =>
                  setTipoCusto(event.target.value as tipo_custo_funcionario)
                }
                required
              >
                <option value="" disabled hidden>
                  Selecione uma opção
                </option>
                <option value="diaria">Diária</option>
                <option value="mensal">Mensal</option>
              </select>
            </div>
            <div>
              <Label htmlFor="conta_bancaria">Conta bancária</Label>
              <Input
                type="text"
                id="conta_bancaria"
                name="conta_bancaria"
                defaultValue={contaBancaria}
              />
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
        temCerteza="Tem certeza que deseja excluir o funcionário?"
        estaAcao="Esta ação não pode ser desfeita e significa excluir o recurso do histórico de tarefas"
      />
    </>
  )
}
