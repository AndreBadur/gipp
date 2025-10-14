import { redirect } from 'next/navigation'
import LogoutButton from '@/components/project/LogoutButton'
import { getServerSession } from 'next-auth'

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
