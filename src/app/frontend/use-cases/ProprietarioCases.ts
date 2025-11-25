import { IProprietario } from '@/app/backend/services/ProprietarioService'
import { verifyApiResponse } from '../lib/tools'
import { IApiResponse } from '../lib/interfaces'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  'http://localhost:3000/api/routeHandler'

export async function criarProprietario(
  registro: string,
  cep: string,
  endereco: string,
  numero: string,
  email: string,
  nome: string
): Promise<IApiResponse<IProprietario> | undefined> {
  try {
    const response = await fetch(API_BASE_URL, {
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

    const result = await response.json()
    verifyApiResponse(result)

    return result
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export async function buscarProprietarioPorEmail(
  email: string
): Promise<IApiResponse<IProprietario> | undefined> {
  if (email === '') {
    throw Error('email inválido na busca pelo proprietário')
  }

  try {
    const params = new URLSearchParams({
      class: 'ProprietarioService',
      method: 'buscarProprietarioPorEmail',
      email,
    })

    const response = await fetch(`${API_BASE_URL}?${params.toString()}`, {
      method: 'GET',
    })

    const result = await response.json()
    verifyApiResponse(result)

    return result
  } catch (error) {
    console.log(error)
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
): Promise<IApiResponse<IProprietario> | undefined> {
  try {
    const response = await fetch(API_BASE_URL, {
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

    const result = await response.json()
    verifyApiResponse(result)

    return result
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export async function deletarProprietario(email: string) {
  try {
    const response = await fetch(API_BASE_URL, {
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

    const result = await response.json()
    verifyApiResponse(result)

    return result
  } catch (error) {
    console.error(error)
    return undefined
  }
}
