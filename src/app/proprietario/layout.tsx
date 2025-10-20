import LogoutButton from '@/components/project/LogoutButton'
import { getServerSession } from 'next-auth'
import SessionProvider from './SessionProvider'
import { redirect } from 'next/navigation'
import Header from '@/components/project/Header'

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
      {children}
      <LogoutButton />
    </SessionProvider>
  )
}
