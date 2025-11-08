'use client'

import { Button } from '@/components/ui/button'
import { redirectSignIn, redirectSignUp } from './frontend/lib/tools'
import Header from '@/components/project/Header'

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center relative overflow-hidden">
      <Header showAuth={true} />
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-background to-blue-50/30 dark:from-orange-950/20 dark:via-background dark:to-blue-950/20"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-primary/20 to-orange-300/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-300/20 to-primary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="text-center space-y-12 max-w-6xl mx-auto px-4 relative z-10">
        <div className="space-y-8">
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-orange-400/20 to-primary/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
            <h1 className="relative text-6xl md:text-8xl lg:text-9xl font-black text-primary animate-in fade-in-0 slide-in-from-bottom-4 duration-1000">
              G.I.P.P.
            </h1>
          </div>

          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight animate-in fade-in-0 slide-in-from-bottom-6 duration-1000 delay-300">
            Gerenciamento Integrado de
            <br />
            <span className="text-primary">Propriedades Produtivas</span>
          </h2>
        </div>

        <div className="space-y-8 animate-in fade-in-0 slide-in-from-bottom-8 duration-1000 delay-500">
          <div className="space-y-4">
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium">
              A plataforma completa para gerenciar suas propriedades
            </p>
            <p className="text-lg md:text-xl text-muted-foreground/80 max-w-2xl mx-auto">
              Controle, monitore e otimize sua produção com tecnologia de ponta
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-4">
            <Button
              onClick={redirectSignIn}
              size="lg"
              className="w-full sm:w-auto min-w-[200px] text-lg py-6 font-semibold shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 via-orange-500 to-primary hover:from-orange-600 hover:via-primary hover:to-orange-600 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center gap-2">
                Começar Agora
                <svg
                  className="w-5 h-5 transition-transform group-hover:rotate-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
            <Button
              onClick={redirectSignUp}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto min-w-[200px] text-lg py-6 font-semibold border-2 hover:bg-gradient-to-r hover:from-primary/10 hover:to-orange-500/10 transition-all duration-300 hover:scale-105 hover:shadow-lg group"
            >
              <span className="flex items-center gap-2">
                Saber Mais
                <svg
                  className="w-5 h-5 transition-transform group-hover:rotate-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
