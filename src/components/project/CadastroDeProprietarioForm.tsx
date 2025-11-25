'use client'

import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { FormEvent, useContext, useEffect, useRef, useState } from 'react'
import { Checkbox } from '../ui/checkbox'
import { useMask } from '@react-input/mask'
import {
  outFormatCNPJ,
  outFormatCPF,
  validarCNPJ,
  validarCPF as validarCPF,
} from '@/app/frontend/lib/tools'
import {
  atualizarProprietarioPorEmail,
  buscarProprietarioPorEmail,
  criarProprietario,
  deletarProprietario,
} from '@/app/frontend/use-cases/ProprietarioCases'
import { SessionContext } from '@/app/proprietario/SessionProvider'
import { Toast } from '../ui/toast'
import DialogConfirmaDelecao from './DialogConfirmaDelecao'

export default function CadastroDeProprietarioForm() {
  const [isPessoaJuridica, setIsPessoaJuridica] = useState<boolean>(false)
  const [nomeCompleto, setNomeCompleto] = useState<string>('')
  const [registro, setRegistro] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [cep, setCep] = useState<string>('')
  const [endereco, setEndereco] = useState<string>('')
  const [numero, setNumero] = useState<string>('')
  const [existente, setExistente] = useState<boolean>(false)
  const [toast, setToast] = useState<{
    title: string
    description?: string
    variant: 'default' | 'success' | 'error'
  } | null>(null)
  const deleteDialogRef = useRef<HTMLDialogElement>(null)
  const registroMask = useMask({
    mask: isPessoaJuridica ? '__.___.___/____-__' : '___.___.___-__',
    replacement: { _: /\d/ },
  })
  const inputCEPMask = useMask({
    mask: '_____-___',
    replacement: { _: /\d/ },
  })

  const session = useContext(SessionContext)

  const verificarTipoUsuario = () => {
    if (isPessoaJuridica === true) {
      setIsPessoaJuridica(false)
    } else {
      setIsPessoaJuridica(true)
    }
  }

  async function validarESalvar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const nome = formData.get('nome') as string
    const registro = (formData.get('registro') as string).replace(/\D/g, '')
    const cep = formData.get('cep') as string
    const endereco = formData.get('endereco') as string
    const numero = formData.get('numero') as string
    const emailForm = session?.session?.user?.email ?? email

    let valido: boolean
    if (isPessoaJuridica) {
      valido = validarCNPJ(registro)
    } else {
      valido = validarCPF(registro)
    }

    if (valido) {
      try {
        const resultado = existente
          ? await atualizarProprietarioPorEmail(
              registro,
              cep,
              endereco,
              numero,
              emailForm,
              nome
            )
          : await criarProprietario(
              registro,
              cep,
              endereco,
              numero,
              emailForm,
              nome
            )

        if (resultado && resultado.success) {
          setExistente(true)
          setToast({
            title: existente
              ? 'Proprietário atualizado!'
              : 'Proprietário criado!',
            description: `${nome} foi ${
              existente ? 'atualizado' : 'cadastrado'
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
    } else {
      setToast({
        title: 'Dados inválidos',
        description: `${
          isPessoaJuridica ? 'CNPJ' : 'CPF'
        } inválido. Verifique os dados inseridos.`,
        variant: 'error',
      })
    }
  }

  async function resultadoDeleçao() {
    try {
      const resultado = await deletarProprietario(email)

      if (resultado && resultado.success) {
        setToast({
          title: 'Proprietário excluido!',
          description: `${nomeCompleto} foi excluído com sucesso.`,
          variant: 'success',
        })
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

  useEffect(() => {
    if (session?.session?.user?.email) {
      buscarProprietarioPorEmail(session?.session?.user?.email)
        .then((data) => {
          if (data) {
            setNomeCompleto(data.data.dataConnection.nome)
            setRegistro(data.data.dataConnection.registro)
            setCep(data.data.dataConnection.cep)
            setEmail(data.data.dataConnection.email)
            setEndereco(data.data.dataConnection.endereco)
            setNumero(data.data.dataConnection.numero)
            setExistente(true)

            if (inputCEPMask.current) {
              inputCEPMask.current.value = data.data.dataConnection.cep
            }

            if (data.data.dataConnection.registro.length > 12) {
              setIsPessoaJuridica(true)
              if (registroMask.current)
                registroMask.current.value = outFormatCNPJ(
                  data.data.dataConnection.registro
                )
            } else {
              if (registroMask.current)
                registroMask.current.value = outFormatCPF(
                  data.data.dataConnection.registro
                )
            }
          } else {
            setEmail(session?.session?.user?.email ?? '')
          }
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }, [session, inputCEPMask, registroMask])

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
        onSubmit={validarESalvar}
      >
        <div className={`w-full h-auto`}>
          <div className="grid h-full gap-1 px-3.5 pb-2">
            <div>
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                type="nome"
                id="nome"
                name="nome"
                defaultValue={nomeCompleto}
                required
              />
            </div>
            <div>
              <div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="juridico"
                    onCheckedChange={() => verificarTipoUsuario()}
                    disabled={existente}
                    checked={isPessoaJuridica}
                  />
                  <Label className={'m-2'} htmlFor="juridico">
                    Pessoa Jurífica
                  </Label>
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="registro">
                {isPessoaJuridica ? 'CNPJ *' : 'CPF *'}
              </Label>

              <Input
                id="registro"
                name="registro"
                ref={registroMask}
                defaultValue={registro}
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
                disabled
              />
            </div>
            <div>
              <Label htmlFor="cep">CEP *</Label>
              <Input
                type="text"
                id="cep"
                name="cep"
                required
                ref={inputCEPMask}
                defaultValue={cep}
              />
            </div>
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
              <Label htmlFor="numero">Número *</Label>
              <Input
                type="numero"
                id="numero"
                name="numero"
                defaultValue={numero}
                required
              />
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
        temCerteza="Tem certeza que deseja excluir o proprietário?"
        estaAcao="Esta ação não pode ser desfeita e significa excluir todos os recursos relacionados"
      />
    </>
  )
}
