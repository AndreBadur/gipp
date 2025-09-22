'use client'

import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { FormEvent, useState } from 'react'
import { Checkbox } from '../ui/checkbox'
import { useMask } from '@react-input/mask'

export default function CadastroDeProprietarioForm() {
  const [isPessoaJuridica, setIsPessoaJuridica] = useState<boolean>(false)
  const inputCpfMask = useMask({
    mask: '___.___.___-__',
    replacement: { _: /\d/ },
  })
  const inputCnpjMask = useMask({
    mask: '__.___.___/____-__',
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

    const nome = formData.get('nome') as string
    const registro = (formData.get('registro') as string).replace(/\D/g, '')
    const cep = formData.get('cep') as string
    const endereco = formData.get('endereco') as string
    const numero = formData.get('numero') as string

    const data = { nome, registro, cep, endereco, numero }
    console.log('Dados enviados:', data)
  }

  return (
    <form
      className={`bg-secondary-background h-auto w-full p-1 rounded-lg`}
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

          <div className="flex flex-col gap-2.5 h-auto mt-2">
            <Button type="submit">
              <p className="font-semibold">CADASTRAR</p>
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
