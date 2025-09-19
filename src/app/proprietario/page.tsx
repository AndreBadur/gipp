'use client'
import CadastroDeProprietarioForm from '@/components/project/CadastroDeProprietarioForm'
import LogoutButton from '@/components/project/LogoutButton'
import { getServerSession } from 'next-auth'

export default async function Page() {
  const session = await getServerSession()

  return (
    <div>
      Página do proprietário
      <div>olá {session?.user?.name}</div>
      <LogoutButton />
      <CadastroDeProprietarioForm />
    </div>
  )
}
