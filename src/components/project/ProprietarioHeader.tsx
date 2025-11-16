'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import DialogProprietario, {
  DialogProprietarioHandle,
} from './DialogProprietario'
import { LogOut, Menu, UserRound } from 'lucide-react'
import { useMemo, useRef } from 'react'
import { signOut } from 'next-auth/react'

interface ProprietarioHeaderProps {
  onMenuClick: () => void
  userName?: string | null
  userEmail?: string | null
}

export default function ProprietarioHeader({
  onMenuClick,
  userName,
  userEmail,
}: ProprietarioHeaderProps) {
  const displayName = userName || userEmail || 'Proprietário'
  const dialogRef = useRef<DialogProprietarioHandle>(null)

  const initials = useMemo(() => {
    if (!displayName) return 'P'
    const parts = displayName.trim().split(' ').filter(Boolean)
    if (parts.length === 0) {
      return 'P'
    }
    const firstTwo = parts
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
    return firstTwo.join('') || 'P'
  }, [displayName])

  const handleProfileInfo = () => {
    dialogRef.current?.open()
  }

  return (
    <header className="sticky top-0 z-20 border-b border-border/40 bg-secondary-background/90 px-4 py-3 backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMenuClick}
            aria-label="Abrir menu de navegação"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Painel do proprietário
            </p>
            <h1 className="text-lg font-semibold text-foreground">
              Olá, {displayName.split(' ')[0]}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden text-right text-xs md:block">
            <p className="font-semibold text-foreground">{displayName}</p>
            <p className="text-muted-foreground">{userEmail}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full border border-border/60 text-sm font-semibold"
                aria-label="Abrir opções do perfil"
              >
                {initials}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-60 border border-border/70 bg-secondary-background/95 shadow-2xl shadow-black/40 backdrop-blur"
            >
              <DropdownMenuLabel>
                <p className="text-sm font-semibold text-foreground">
                  {displayName}
                </p>
                <p className="text-xs text-muted-foreground">{userEmail}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer gap-5"
                onSelect={() => handleProfileInfo()}
              >
                <UserRound className="h-4 w-4" />
                Informações do perfil
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer gap-5 text-red-400 focus:border-red-400"
                onSelect={() => signOut()}
              >
                <LogOut className="h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <DialogProprietario ref={dialogRef} showTriggerButton={false} />
    </header>
  )
}
