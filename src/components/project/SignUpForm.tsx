import { signIn } from 'next-auth/react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { FormEvent, useState } from 'react'
import { Checkbox } from '../ui/checkbox'
import { validarCpf, validarSenha, validCNPJ } from '@/app/frontend/lib/tools'
import { useMask } from '@react-input/mask'

export default function SignUpForm() {
  const [error, setError] = useState<string>('')
  const [isPessoaJuridica, setIsPessoaJuridica] = useState<boolean>(false)
  const inputCpfMask = useMask({
    mask: '___.___.___-__',
    replacement: { _: /\d/ },
  })
  const inputCnpjMask = useMask({
    mask: '__.___.___/____-__',
    replacement: { _: /\d/ },
  })
  const inputTelefoneMask = useMask({
    mask: '(__)_____-____',
    replacement: { _: /\d/ },
  })
  const inputCEPMask = useMask({
    mask: '_____-___',
    replacement: { _: /\d/ },
  })

  const verificarTipoUsuario = () => {
    if (isPessoaJuridica === true) {
      setIsPessoaJuridica(false)
    } else {
      setIsPessoaJuridica(true)
    }
  }

  async function validateAndRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const email = formData.get('email') as string
    const senha = formData.get('password') as string
    const confirmaSenha = formData.get('confirm_password') as string
    const registro = (formData.get('registro') as string).replace(/\D/g, '')

    isPessoaJuridica
      ? console.log('meu cnpj está ' + validCNPJ(registro))
      : console.log('Meu cpf está ' + validarCpf(registro))

    setError(validarSenha(senha, confirmaSenha))

    const data = { email, senha, confirmaSenha, registro }
    console.log('Dados enviados:', data)
  }

  function loginGitHub() {
    signIn('github', { callbackUrl: '/proprietario' })
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
            <Label htmlFor="nome">Nome Completo *</Label>
            <Input type="nome" id="nome" name="nome" required />
          </div>
          <div>
            <div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="juridico"
                  onCheckedChange={() => verificarTipoUsuario()}
                />
                <Label className={'m-2'} htmlFor="juridico">
                  Pessoa Jurídica
                </Label>
              </div>
            </div>
          </div>
          <div>
            <Label htmlFor={isPessoaJuridica ? 'cnpj' : 'cpf'}>
              {isPessoaJuridica ? 'CNPJ' : 'CPF'}
            </Label>
            <Input
              id="registro"
              name="registro"
              ref={isPessoaJuridica ? inputCnpjMask : inputCpfMask}
              required
            />
          </div>
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
            <Label htmlFor="cep">CEP</Label>
            <Input
              type="text"
              id="cep"
              name="cep"
              required
              ref={inputCEPMask}
            />
          </div>
          <div>
            <Label htmlFor="endereco">Endereço</Label>
            <Input type="text" id="endereco" name="endereco" required />
          </div>
          <div>
            <Label htmlFor="numero">Número</Label>
            <Input type="numero" id="numero" name="numero" required />
          </div>
          <div>
            <Label htmlFor="password">Senha</Label>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="Senha"
              required
            />
          </div>
          <div>
            <Label htmlFor="confirm_password">Confirmação de Senha</Label>
            <Input
              type="password"
              id="confirm_password"
              name="confirm_password"
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
            <Button type="button" onClick={loginGitHub}>
              <p className="font-semibold">CADASTRAR PELO GITHUB</p>
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
