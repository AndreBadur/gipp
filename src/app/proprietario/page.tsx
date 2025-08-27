import LogoutButton from '@/components/project/LogoutButton'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function Page() {
  const session = await getServerSession()

  return (
    <div>
      Página do proprietário
      <div>olá {session?.user?.name}</div>
      <LogoutButton />
    </div>
  )
}
