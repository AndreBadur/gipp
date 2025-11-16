'use client'

import React from 'react'
import { Session } from 'next-auth'

export const SessionContext = React.createContext<sessionBody>({
  session: null,
  idProprietario: null,
})

interface sessionBody {
  session: Session | null
  idProprietario: number | null
}
interface SessionProviderProps {
  children: React.ReactNode
  sessionBody: sessionBody
}

export default function SessionProvider({
  children,
  sessionBody,
}: SessionProviderProps) {
  return (
    <SessionContext.Provider value={sessionBody}>
      {children}
    </SessionContext.Provider>
  )
}
