'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Session } from 'next-auth'
import { IPropriedade } from '../backend/services/PropriedadeService'
import { buscarTodasPropriedades } from '../frontend/use-cases/PropriedadeCases'

const STORAGE_KEY = 'selectedPropriedadeId'

export interface SessionContextValue extends sessionBody {
  propriedades: IPropriedade[]
  propriedadesCarregando: boolean
  propriedadeSelecionadaId: number | null
  setPropriedadeSelecionadaId: (id: number | null) => void
}

export const SessionContext = React.createContext<SessionContextValue>({
  session: null,
  idProprietario: null,
  propriedades: [],
  propriedadesCarregando: false,
  propriedadeSelecionadaId: null,
  setPropriedadeSelecionadaId: () => {},
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
  const [propriedades, setPropriedades] = useState<IPropriedade[]>([])
  const [propriedadesCarregando, setPropriedadesCarregando] = useState(false)
  const [propriedadeSelecionadaId, setPropriedadeSelecionadaId] = useState<
    number | null
  >(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const storedId = window.localStorage.getItem(STORAGE_KEY)
    if (storedId) {
      setPropriedadeSelecionadaId(Number(storedId))
    }
  }, [])

  useEffect(() => {
    if (!sessionBody.idProprietario) {
      setPropriedades([])
      setPropriedadeSelecionadaId(null)
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(STORAGE_KEY)
      }
      return
    }

    setPropriedadesCarregando(true)
    buscarTodasPropriedades(sessionBody.idProprietario)
      .then((response) => {
        const lista = response?.data.dataConnection ?? []
        setPropriedades(lista)
        setPropriedadeSelecionadaId((prev) => {
          if (prev && lista.some((propriedade) => propriedade.id === prev)) {
            return prev
          }
          const fallback = lista[0]?.id ?? null
          if (typeof window !== 'undefined') {
            if (fallback) {
              window.localStorage.setItem(STORAGE_KEY, String(fallback))
            } else {
              window.localStorage.removeItem(STORAGE_KEY)
            }
          }
          return fallback
        })
      })
      .finally(() => setPropriedadesCarregando(false))
  }, [sessionBody.idProprietario])

  const handleSelecionarPropriedade = useCallback((id: number | null) => {
    setPropriedadeSelecionadaId(id)
    if (typeof window === 'undefined') return
    if (id) {
      window.localStorage.setItem(STORAGE_KEY, String(id))
    } else {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  const contextValue = useMemo<SessionContextValue>(
    () => ({
      session: sessionBody.session,
      idProprietario: sessionBody.idProprietario,
      propriedades,
      propriedadesCarregando,
      propriedadeSelecionadaId,
      setPropriedadeSelecionadaId: handleSelecionarPropriedade,
    }),
    [
      propriedades,
      propriedadesCarregando,
      propriedadeSelecionadaId,
      handleSelecionarPropriedade,
      sessionBody.session,
      sessionBody.idProprietario,
    ]
  )

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  )
}
