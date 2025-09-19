import { signIn } from 'next-auth/react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { FormEvent, useState } from 'react'
import { validarSenha } from '@/app/frontend/lib/tools'
import { useMask } from '@react-input/mask'

export default function SignUpForm() {
  const [error, setError] = useState<string>('')

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

    const data = { email, telefone, senha, confirmaSenha }
    console.log('Dados enviados:', data)
  }

  function loginGoogle() {
    signIn('google', { callbackUrl: '/proprietario' })
  }

  return (
    <form
      className={` bg-secondary-background h-auto w-[90%] p-1 rounded-lg 
         md:w-[45%]`}
      onSubmit={validateAndRegister}
    >
      <div className={`w-full h-auto`}>
        <div className="grid h-full gap-1 px-3.5 pb-2">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" name="email" required />
          </div>
          <div>
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              type="text"
              id="telefone"
              name="telefone"
              ref={inputTelefoneMask}
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

          <div className="flex flex-col gap-2.5 h-auto mt-2">
            <Button type="submit">
              <p className="font-semibold">CADASTRAR</p>
            </Button>
          </div>

          <div className="flex items-center ">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="px-1 text-gray-600 text-lg">ou</span>
            <div className="flex-grow border-t border-gray-600"></div>
          </div>

          <div className="flex flex-col gap-2.5 h-auto my-2">
            <Button
              type="button"
              onClick={() => console.log('cadastro via facebook')}
            >
              <p className="font-semibold">CADASTRAR PELO FACEBOOK</p>
            </Button>
            <Button type="button" onClick={loginGoogle}>
              <p className="font-semibold">CADASTRAR PELO GOOGLE</p>
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
