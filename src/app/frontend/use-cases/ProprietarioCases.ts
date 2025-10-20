import { IProprietario } from '@/app/backend/services/ProprietarioService'
import { verifyApiResponse } from '../lib/tools'

interface IProprietarioResponse {
  success: boolean
  data: {
    data: IProprietario
    status: number
  }
}

export async function criarProprietario(
  registro: string,
  cep: string,
  endereco: string,
  numero: string,
  email: string,
  nome: string
): Promise<IProprietarioResponse | undefined> {
  try {
    const response = await fetch('http://localhost:3000/api/routeHandler', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        class: 'ProprietarioService',
        method: 'criarProprietario',
        payload: { registro, cep, endereco, numero, email, nome },
      }),
    })

    verifyApiResponse(response)
    return response.json()
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export async function buscarProprietarioPorEmail(
  email: string
): Promise<IProprietarioResponse | undefined> {
  if (email === '') {
    throw Error('email inválido na busca pelo proprietário')
  }

  try {
    const response = await fetch(
      `http://localhost:3000/api/routeHandler?class=ProprietarioService&method=buscarProprietarioPorEmail&email=${email}`,
      {
        method: 'GET',
      }
    )

    verifyApiResponse(response)
    return response.json()
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export async function atualizarProprietarioPorEmail(
  registro: string,
  cep: string,
  endereco: string,
  numero: string,
  email: string,
  nome: string
): Promise<IProprietarioResponse | undefined> {
  try {
    const response = await fetch('http://localhost:3000/api/routeHandler', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        class: 'ProprietarioService',
        method: 'atualizarProprietarioPorEmail',
        payload: { registro, cep, endereco, numero, email, nome },
      }),
    })

    verifyApiResponse(response)
    return response.json()
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export async function deletarProprietario(email: string) {
  try {
    const response = await fetch('http://localhost:3000/api/routeHandler', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        class: 'ProprietarioService',
        method: 'deletarProprietarioPorEmail',
        payload: { email },
      }),
    })

    verifyApiResponse(response)
    return response.json()
  } catch (error) {
    console.error(error)
    return undefined
  }
}
