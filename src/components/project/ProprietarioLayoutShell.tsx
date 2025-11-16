'use client'

import { ReactNode, useState } from 'react'
import ProprietarioSidebar, {
  ProprietarioNavItem,
} from './ProprietarioSidebar'
import ProprietarioHeader from './ProprietarioHeader'

interface ProprietarioLayoutShellProps {
  navItems: ProprietarioNavItem[]
  children: ReactNode
  userName?: string | null
  userEmail?: string | null
}

export default function ProprietarioLayoutShell({
  navItems,
  children,
  userName,
  userEmail,
}: ProprietarioLayoutShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-secondary-background text-foreground">
      <div className="flex min-h-screen flex-col md:flex-row">
        <ProprietarioSidebar
          items={navItems}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <div className="flex flex-1 flex-col">
          <ProprietarioHeader
            onMenuClick={() => setIsSidebarOpen(true)}
            userName={userName}
            userEmail={userEmail}
          />
          <main className="flex-1 p-4">{children}</main>
        </div>
      </div>
    </div>
  )
}
