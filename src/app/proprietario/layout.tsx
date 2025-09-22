import { redirect } from 'next/navigation'
import useGetServerSession from '../frontend/lib/useGetServerSession'
import LogoutButton from '@/components/project/LogoutButton'

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { session } = await useGetServerSession()

  if (!session) {
    redirect('/')
  }

  return (
    <html lang="pt-br" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        {children}
        <LogoutButton />
        <br />
        {session.user?.email}
        <br />
        {session.user?.name}
        <br />
        {session.user?.image}
      </body>
    </html>
  )
}
