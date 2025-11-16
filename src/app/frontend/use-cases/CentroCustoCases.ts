import { ICentroCusto } from '@/app/backend/services/CentroCustoService'
import { verifyApiResponse } from '../lib/tools'

export interface ICentroCustoResponse {
  success: boolean
  data: {
    dataConnection: ICentroCusto
    status: number
  }
}

export interface IListaCentroCustosResponse {
  success: boolean
  data: {
    dataConnection: ICentroCusto[]
    status: number
  }
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  'http://localhost:3000/api/routeHandler'

export async function criarCentroCusto(
  nome: string,
  id_propriedade: number
): Promise<ICentroCustoResponse | undefined> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        class: 'CentroCustoService',
        method: 'criarCentroCusto',
        payload: {
          nome,
          id_propriedade,
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

export async function buscarCentroCustoPorIdEPropriedade(
  id: string,
  id_propriedade: number
): Promise<ICentroCustoResponse | undefined> {
  try {
    const params = new URLSearchParams({
      class: 'CentroCustoService',
      method: 'buscarCentroCustoPorId',
      id,
      id_propriedade: id_propriedade.toString(),
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

export async function buscarTodosCentrosDeCusto(
  id_propriedade: number
): Promise<IListaCentroCustosResponse | undefined> {
  try {
    const params = new URLSearchParams({
      class: 'CentroCustoService',
      method: 'buscarTodosCentrosDeCusto',
      id_propriedade: id_propriedade.toString(),
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

export async function atualizarCentroCustoPorId(
  id: string,
  nome: string,
  id_propriedade: number
): Promise<ICentroCustoResponse | undefined> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        class: 'CentroCustoService',
        method: 'atualizarCentroCustoPorId',
        payload: {
          id,
          nome,
          id_propriedade,
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

export async function deletarCentroCusto(
  id: string
): Promise<ICentroCustoResponse | undefined> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        class: 'CentroCustoService',
        method: 'deletarCentroCustoPorId',
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
