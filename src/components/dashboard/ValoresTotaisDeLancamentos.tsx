'use client'

import { valoresTotaisDeLancamentosEmTodasPropriedades } from '@/app/frontend/use-cases/DashboardCases'
import { SessionContext } from '@/app/proprietario/SessionProvider'
import { useContext, useEffect, useState } from 'react'

export default function ValoresTotaisDeLancamentos() {
  const session = useContext(SessionContext)
  const { idProprietario } = session
  const [saldo, setSaldo] = useState<number>()
  const [entrada, setEntrada] = useState<number>()
  const [saida, setSaida] = useState<number>()

  useEffect(() => {
    valoresTotaisDeLancamentosEmTodasPropriedades(idProprietario ?? 0).then(
      (data) => {
        console.log('data in componente')
        console.log(data)
        setSaldo(data.saldo)
        setEntrada(data.totalEntradaDoMes)
        setSaida(data.totalSaidaDoMes)
      }
    )
  }, [session, idProprietario])

  return (
    <div className="flex flex-row gap-3 bg-background/5">
      <div>{saldo}</div>
      <div>{entrada}</div>
      <div>{saida}</div>
    </div>
  )
}
