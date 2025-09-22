'use client'

import LogoButton from '@/components/project/LogoButton'
import { Button } from '@/components/ui/button'
import { redirectSignIn, redirectSignUp } from './frontend/lib/tools'

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen">
      <LogoButton />
      <p className="font-black text-4xl m-2">
        Gerenciamento Integrado de Propriedades Produtivas
      </p>
      <div className="flex w-auto gap-2 mt-5">
        <Button onClick={redirectSignIn}>ENTRAR</Button>
        <Button onClick={redirectSignUp}>CADASTRAR</Button>
      </div>
    </div>
  )
}
