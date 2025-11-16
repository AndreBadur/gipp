import { IPropriedade } from '@/app/backend/services/PropriedadeService'
import { verifyApiResponse } from '../lib/tools'

export interface IPropriedadeResponse {
  success: boolean
  data: {
    dataConnection: IPropriedade
    status: number
  }
}

export interface IListaPropriedadesResponse {
  success: boolean
  data: {
    dataConnection: IPropriedade[]
    status: number
  }
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  'http://localhost:3000/api/routeHandler'

export async function criarPropriedade(
  endereco: string,
  gerente: string | undefined,
  cnpj: string | undefined,
  id_proprietario: number
): Promise<IPropriedadeResponse | undefined> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        class: 'PropriedadeService',
        method: 'criarPropriedade',
        payload: {
          endereco,
          gerente,
          cnpj,
          id_proprietario,
        },
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

export async function buscarPropriedadePorIdEProprietario(
  id: string,
  idProprietario: number
): Promise<IPropriedadeResponse | undefined> {
  try {
    const params = new URLSearchParams({
      class: 'PropriedadeService',
      method: 'buscarPropriedadePorId',
      id,
      id_proprietario: idProprietario.toString(),
    })

    const response = await fetch(`${API_BASE_URL}?${params.toString()}`, {
      method: 'GET',
    })

    const result = await response.json()
    verifyApiResponse(result)

    return result
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export async function buscarTodasPropriedades(
  idProprietario: number
): Promise<IListaPropriedadesResponse | undefined> {
  try {
    const params = new URLSearchParams({
      class: 'PropriedadeService',
      method: 'buscarTodasPropriedades',
      id_proprietario: idProprietario.toString(),
    })

    const response = await fetch(`${API_BASE_URL}?${params.toString()}`, {
      method: 'GET',
    })

    const result = await response.json()
    verifyApiResponse(result)

    return result
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export async function atualizarPropriedadePorId(
  id: string,
  endereco: string,
  gerente: string | undefined,
  cnpj: string | undefined,
  id_proprietario: number
): Promise<IPropriedadeResponse | undefined> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        class: 'PropriedadeService',
        method: 'atualizarPropriedadePorId',
        payload: {
          id,
          endereco,
          gerente,
          cnpj,
          id_proprietario,
        },
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

export async function deletarPropriedade(
  id: string
): Promise<IPropriedadeResponse | undefined> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        class: 'PropriedadeService',
        method: 'deletarPropriedadePorId',
        payload: { id },
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
