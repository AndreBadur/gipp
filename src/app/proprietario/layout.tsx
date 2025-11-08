import LogoutButton from '@/components/project/LogoutButton'
import { getServerSession } from 'next-auth'
import SessionProvider from './SessionProvider'
import { redirect } from 'next/navigation'

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession()

  if (!session) {
    redirect('/')
  }

  return (
    <SessionProvider session={session}>
      CONTEÚDO DO LAYOUT DE PROPRIETARIO
      {children}
      <div className="flex fixed bottom-4 left-4 z-50">
        <LogoutButton />
      </div>
    </SessionProvider>
  )
}
