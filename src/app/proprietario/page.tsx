import LogoutButton from '@/components/project/LogoutButton'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function Page() {
  const session = await getServerSession()

  if (!session) {
    redirect('/')
  }
  return (
    <div>
      Página do proprietario
      <div>olá {session?.user?.name}</div>
      <LogoutButton />
    </div>
  )
}
