'use client'

import { Button } from '@/components/ui/button'
import { redirect } from 'next/navigation'

export default function Home() {
  function redirectSignIn() {
    redirect('/sign/in')
  }

  function redirectSignUp() {
    redirect('/sign/up')
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen">
      <p className="font-black text-7xl">G.I.P.P.</p>
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
