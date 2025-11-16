import { signIn } from 'next-auth/react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { FormEvent, useRef, useState } from 'react'
import { redirectSignIn, validarSenha } from '@/app/frontend/lib/tools'
import { useMask } from '@react-input/mask'
import { criarUsuario } from '@/app/frontend/use-cases/UsuarioCases'

export default function SignUpForm() {
  const [error, setError] = useState<string>('')
  const dialogRef = useRef<HTMLDialogElement>(null)

  const inputTelefoneMask = useMask({
    mask: '(__)_____-____',
    replacement: { _: /\d/ },
  })

  async function validateAndRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const email = formData.get('email') as string
    const telefone = formData.get('telefone') as string
    const senha = formData.get('senha') as string
    const confirmaSenha = formData.get('confirma_senha') as string

    setError(validarSenha(senha, confirmaSenha))

    if (await criarUsuario(email, telefone, senha)) {
      dialogRef.current?.showModal()
    }
  }

  function handleDialogConfirm() {
    dialogRef.current?.close()
    redirectSignIn()
  }

  function loginFacebook() {
    signIn('facebook', { callbackUrl: '/proprietario' })
  }

  function loginGoogle() {
    signIn('google', { callbackUrl: '/proprietario' })
  }

  return (
    <>
      <div className="bg-secondary-background h-auto p-1 rounded-lg lg:w-[20%] md:w-[50%] sm:w-[20%]">
        <form
          className={` bg-secondary-background h-auto w-auto p-1 rounded-lg`}
          onSubmit={validateAndRegister}
        >
          <div className={`w-full h-auto`}>
            <div className="grid h-full gap-1 px-3.5 pb-2">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="email@domínio.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  type="text"
                  id="telefone"
                  name="telefone"
                  ref={inputTelefoneMask}
                  placeholder="(DDD) 99999-9999"
                  required
                />
              </div>
              <div>
                <Label htmlFor="senha">Senha</Label>
                <Input
                  type="password"
                  id="senha"
                  name="senha"
                  placeholder="Senha"
                  required
                />
              </div>
              <div>
                <Label htmlFor="confirma_senha">Confirmação de Senha</Label>
                <Input
                  type="password"
                  id="confirma_senha"
                  name="confirma_senha"
                  placeholder="Confirme sua senha"
                  required
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>

              <div className="flex flex-col gap-3 h-auto mt-2">
                <Button type="submit">
                  <p className="font-semibold">CADASTRAR</p>
                </Button>
              </div>

              <div className="flex items-center ">
                <div className="flex-grow border-t border-gray-600"></div>
                <span className="px-1 text-gray-600 text-lg">ou</span>
                <div className="flex-grow border-t border-gray-600"></div>
              </div>

              <div className="flex flex-col gap-3 h-auto my-2">
                <Button type="button" onClick={loginFacebook}>
                  <p className="font-semibold">CADASTRAR PELO FACEBOOK</p>
                </Button>
                <Button type="button" onClick={loginGoogle}>
                  <p className="font-semibold">CADASTRAR PELO GOOGLE</p>
                </Button>
              </div>
              <div className="mt-3">
                <label>Já possui conta?</label>{' '}
                <label
                  onClick={redirectSignIn}
                  className="cursor-pointer text-blue-500 underline hover:text-blue-600 transition-colors"
                >
                  Entrar
                </label>
              </div>
            </div>
          </div>
        </form>
      </div>
      <dialog
        ref={dialogRef}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-lg p-6 shadow-lg"
      >
        <div className="space-y-4 text-center">
          <h2 className="text-xl font-semibold">
            Usuário criado com sucesso!
          </h2>
          <p className="text-sm text-muted-foreground">
            Você já pode acessar o sistema com suas credenciais.
          </p>
          <div className="flex justify-center">
            <Button type="button" onClick={handleDialogConfirm}>
              Ir para a tela de login
            </Button>
          </div>
        </div>
      </dialog>
    </>
  )
}
