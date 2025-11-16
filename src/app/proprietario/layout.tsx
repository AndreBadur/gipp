import { getServerSession } from 'next-auth'
import SessionProvider from './SessionProvider'
import { redirect } from 'next/navigation'
import { buscarProprietarioPorEmail } from '../frontend/use-cases/ProprietarioCases'
import ProprietarioLayoutShell from '@/components/project/ProprietarioLayoutShell'
import ProprietarioProfilePrompt from '@/components/project/ProprietarioProfilePrompt'
import type { ProprietarioNavItem } from '@/components/project/ProprietarioSidebar'

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession()

  if (!session) {
    redirect('/')
  }

  let idProprietario: number | null = null
  if (session?.user?.email) {
    const proprietario = await buscarProprietarioPorEmail(session.user.email)
    const dataConnection = proprietario?.data?.dataConnection
    if (dataConnection && typeof dataConnection.id === 'number') {
      idProprietario = dataConnection.id
    }
  }

  const navItems: ProprietarioNavItem[] = [
    { label: 'Início', href: '/proprietario' },
    { label: 'Funcionários', href: '/proprietario/funcionario' },
    { label: 'Maquinários', href: '/proprietario/maquinario' },
    {
      label: 'Propriedade',
      href: '/proprietario/propriedade',
      children: [
        { label: 'Tarefas', href: '/proprietario/propriedade/tarefas' },
        {
          label: 'Lançamento Contábil',
          href: '/proprietario/propriedade/lancamento_contabil',
        },
        { label: 'Produtos', href: '/proprietario/propriedade/produtos' },
        { label: 'Áreas', href: '/proprietario/propriedade/areas' },
        {
          label: 'Fornecedores',
          href: '/proprietario/propriedade/fornecedores',
        },
        { label: 'Insumos', href: '/proprietario/propriedade/insumos' },
        {
          label: 'Lançamento Contábil',
          href: '/proprietario/propriedade/lancamento_contabil',
        },
        {
          label: 'Centro de Custo',
          href: '/proprietario/propriedade/centro_custo',
        },
        { label: 'Maquinários', href: '/proprietario/propriedade/maquinarios' },
        {
          label: 'Funcionarios',
          href: '/proprietario/propriedade/funcionarios',
        },
      ],
    },
  ]

  return (
    <SessionProvider sessionBody={{ session, idProprietario }}>
      <>
        <ProprietarioLayoutShell
          navItems={navItems}
          userName={session.user?.name}
          userEmail={session.user?.email}
        >
          {children}
        </ProprietarioLayoutShell>
        <ProprietarioProfilePrompt shouldPrompt={!idProprietario} />
      </>
    </SessionProvider>
  )
}
