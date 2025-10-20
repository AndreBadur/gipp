'use client'

import React from 'react'
import { Session } from 'next-auth'

export const SessionContext = React.createContext<Session | null>(null)

interface SessionProviderProps {
  children: React.ReactNode
  session: Session | null
}

export default function SessionProvider({ children, session }: SessionProviderProps) {
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  )
}