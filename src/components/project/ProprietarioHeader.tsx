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
import { useContext, useMemo, useRef } from 'react'
import { signOut } from 'next-auth/react'
import { SessionContext } from '@/app/proprietario/SessionProvider'

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
  const {
    propriedades,
    propriedadeSelecionadaId,
    setPropriedadeSelecionadaId,
    propriedadesCarregando,
  } = useContext(SessionContext)

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

  const handlePropriedadeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value
    setPropriedadeSelecionadaId(value ? Number(value) : null)
  }

  const propriedadeAtual = useMemo(() => {
    if (!propriedadeSelecionadaId) return null
    return propriedades.find(
      (propriedade) => propriedade.id === propriedadeSelecionadaId
    )
  }, [propriedades, propriedadeSelecionadaId])

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
          </div>
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex flex-col text-xs text-foreground">
            <span className="font-semibold text-sm">Propriedade ativa</span>
            <select
              className="mt-1 rounded-md border border-border/60 bg-secondary-background/60 px-3 py-2 text-sm text-foreground shadow-inner shadow-black/10 focus:outline-none focus:ring-2 focus:ring-primary"
              value={propriedadeSelecionadaId ?? ''}
              onChange={handlePropriedadeChange}
              disabled={propriedadesCarregando || propriedades.length === 0}
            >
              {propriedadesCarregando && (
                <option value="">Carregando propriedades...</option>
              )}
              {!propriedadesCarregando && propriedades.length === 0 && (
                <option value="">Nenhuma propriedade cadastrada</option>
              )}
              {!propriedadesCarregando &&
                propriedades.map((propriedade) => (
                  <option key={propriedade.id} value={propriedade.id}>
                    {propriedade.endereco
                      ? propriedade.endereco
                      : `Propriedade #${propriedade.id}`}
                  </option>
                ))}
            </select>
            {propriedadeAtual?.gerente && (
              <span className="mt-1 text-[0.7rem] text-muted-foreground">
                Gerente: {propriedadeAtual.gerente}
              </span>
            )}
          </div>
          <div className="hidden text-right text-xs md:block">
            <p className="font-semibold text-foreground">{displayName}</p>
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
