'use client'
import {
  buscarTodosRecursos,
  IListaDeRecursosResponse,
} from '@/app/frontend/use-cases/TarefaCases'
import { Chat } from '@/components/chat/Chat'
import { useContext, useEffect, useState } from 'react'
import { SessionContext } from '../../SessionProvider'

export default function ChatPage() {
  const session = useContext(SessionContext)
  const idPropriedade = session.propriedadeSelecionadaId
  const idProprietario = session.idProprietario
  const [recursos, setRecursos] = useState<IListaDeRecursosResponse>()

  useEffect(() => {
    buscarTodosRecursos(idPropriedade ?? 0, idProprietario ?? 0).then(
      (data) => {
        setRecursos(data)
      }
    )
  }, [idPropriedade, idProprietario])

  const listaMaquinarios: [{ modelo: string }] = [{ modelo: '' }]
  recursos?.maquinarios.map((maquinario) => {
    listaMaquinarios.push({
      modelo: maquinario.modelo,
    })
  })

  const listaFuncionarios: [{ nome: string; cargo: string }] = [
    { nome: '', cargo: '' },
  ]
  recursos?.funcionarios.map((funcionario) => {
    listaFuncionarios.push({
      nome: funcionario.nome,
      cargo: funcionario.cargo,
    })
  })

  const listaInsumos: [
    { nome: string; quantidade: number; unidade_medida: string }
  ] = [{ nome: '', quantidade: 0, unidade_medida: '' }]
  recursos?.insumos.map((insumo) => {
    listaInsumos.push({
      nome: insumo.nome,
      quantidade: insumo.quantidade,
      unidade_medida: insumo.unidade_medida,
    })
  })

  listaMaquinarios.splice(0, 1)
  listaFuncionarios.splice(0, 1)
  listaInsumos.splice(0, 1)

  const propriedadeContexto = {
    listaMaquinarios,
    listaFuncionarios,
    listaInsumos,
  }
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Assistente GIPP</h1>
      <Chat context={propriedadeContexto} />
    </main>
  )
}
