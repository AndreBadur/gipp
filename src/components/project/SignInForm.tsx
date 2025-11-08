import { signIn } from 'next-auth/react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { FormEvent } from 'react'
import { redirectSignUp } from '@/app/frontend/lib/tools'

export default function SignInForm() {
  async function login(e: FormEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget)

    const data = {
      email: formData.get('email'),
      senha: formData.get('senha'),
    }

    signIn('credentials', {
      ...data,
      callbackUrl: '/proprietario',
    })
  }

  function loginFacebook() {
    signIn('facebook', { callbackUrl: '/proprietario' })
  }

  function loginGoogle() {
    signIn('google', {
      callbackUrl: '/proprietario',
    })
  }

  return (
    <div className="bg-secondary-background h-auto p-1 rounded-lg lg:w-[20%] md:w-[50%] sm:w-[20%]">
      <form
        className={`bg-secondary-background h-auto w-auto p-1 rounded-lg`}
        onSubmit={(e) => {
          e.preventDefault()
          login(e)
        }}
      >
        <div className={`w-full h-full`}>
          <div className="grid h-full gap-1 px-3.5 pb-2">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="email@domínio.com"
              ></Input>
            </div>
            <div>
              <Label htmlFor="senha">Senha</Label>
              <Input
                type="password"
                id="senha"
                name="senha"
                placeholder="Senha"
              ></Input>
            </div>

            <div className="flex flex-col gap-3 h-auto mt-2">
              <Button type="submit" id="login">
                <p className="font-semibold">ENTRAR</p>
              </Button>
            </div>

            <div className="mt-1">
              <label>Esqueceu a senha?</label>{' '}
              <label
                onClick={redirectSignUp}
                className="cursor-pointer text-blue-500 underline hover:text-blue-600 transition-colors"
              >
                Lembrar
              </label>
            </div>

            <div className="flex items-center ">
              <div className="flex-grow border-t border-gray-600"></div>
              <span className="px-1 text-gray-600 text-lg">ou</span>
              <div className="flex-grow border-t border-gray-600"></div>
            </div>
            <div className="flex flex-col gap-3 h-auto mt-2">
              <Button type="button" onClick={loginFacebook}>
                <p className="font-semibold">ENTRAR PELO FACEBOOK</p>
              </Button>
              <Button
                type="button"
                onClick={() => {
                  loginGoogle()
                }}
              >
                <p className="font-semibold">ENTRAR PELO GOOGLE</p>
              </Button>
            </div>
            <div className="mt-3">
              <label>Novo por aqui?</label>{' '}
              <label
                onClick={redirectSignUp}
                className="cursor-pointer text-blue-500 underline hover:text-blue-600 transition-colors"
              >
                Cadastrar
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
