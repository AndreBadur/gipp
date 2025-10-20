'use client'

import { Button } from '../ui/button'
import {
  redirectHome,
  redirectSignIn,
  redirectSignUp,
} from '@/app/frontend/lib/tools'

interface HeaderProps {
  showAuth?: boolean
}

export default function Header({ showAuth = true }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-background/95 via-background/98 to-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 border-b border-border/50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-row h-16 items-center justify-between">
          <div className="flex items-center group cursor-pointer">
            <div className="relative">
              <h1
                className="text-2xl font-black text-primary transition-all duration-300 group-hover:scale-105"
                onClick={redirectHome}
              >
                G.I.P.P.
              </h1>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-orange-500 transition-all duration-300 group-hover:w-full"></div>
            </div>
          </div>

          {showAuth && (
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={redirectSignIn}
                className="text-sm font-medium"
              >
                Entrar
              </Button>
              <Button
                onClick={redirectSignUp}
                size="sm"
                className="ext-sm font-medium"
              >
                Cadastrar
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
