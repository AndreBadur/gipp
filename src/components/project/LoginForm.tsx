import { signIn } from 'next-auth/react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { FormEvent } from 'react'
import { redirect } from 'next/navigation'

export default function LoginForm() {
  async function login(e: FormEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget)

    const data = {
      email: formData.get('email'),
      senha: formData.get('password'),
    }

    signIn('credentials', {
      ...data,
      callbackUrl: '/proprietario',
    })
  }

  function loginGitHub() {
    signIn('github', {
      callbackUrl: '/proprietario',
    })
  }

  function loginGoogle() {
    signIn('google', {
      callbackUrl: '/proprietario',
    })
  }

  return (
    <form
      className={` bg-secondary-background h-auto w-[90%] p-1 rounded-lg 
        sm:w-[20%]`}
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
              placeholder="Email"
            ></Input>
          </div>
          <div>
            <Label htmlFor="password">Senha</Label>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="Senha"
            ></Input>
          </div>
          <p>Esqueceu a senha?</p>

          <div className="flex flex-col gap-2.5 h-auto mt-2">
            <Button type="submit" id="login">
              <p className="font-semibold">ENTRAR</p>
            </Button>
            <Button
              onClick={() => {
                redirect('/')
              }}
            >
              <p className="font-semibold">CADASTRAR</p>
            </Button>
          </div>

          <div className="flex items-center ">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="px-1 text-gray-600 text-lg">ou</span>
            <div className="flex-grow border-t border-gray-600"></div>
          </div>
          <div className="flex flex-col gap-2.5 h-auto mt-2">
            <Button
              type="button"
              onClick={() => {
                loginGitHub()
              }}
            >
              <p className="font-semibold">ENTRAR PELO GITHUB</p>
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
        </div>
      </div>
    </form>
  )
}
