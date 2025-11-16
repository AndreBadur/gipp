import { IArea } from '@/app/backend/services/AreaService'
import { verifyApiResponse } from '../lib/tools'

export interface IAreaResponse {
  success: boolean
  data: {
    dataConnection: IArea
    status: number
  }
}

export interface IListaAreasResponse {
  success: boolean
  data: {
    dataConnection: IArea[]
    status: number
  }
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  'http://localhost:3000/api/routeHandler'

export async function criarArea(
  nome: string,
  descricao: string | undefined,
  id_propriedade: number
): Promise<IAreaResponse | undefined> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        class: 'AreaService',
        method: 'criarArea',
        payload: {
          nome,
          descricao,
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

export async function buscarAreaPorIdEPropriedade(
  id: string,
  id_propriedade: number
): Promise<IAreaResponse | undefined> {
  try {
    const params = new URLSearchParams({
      class: 'AreaService',
      method: 'buscarAreaPorId',
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

export async function buscarTodasAreas(
  id_propriedade: number
): Promise<IListaAreasResponse | undefined> {
  try {
    const params = new URLSearchParams({
      class: 'AreaService',
      method: 'buscarTodasAreas',
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

export async function atualizarAreaPorId(
  id: string,
  nome: string,
  descricao: string | undefined,
  id_propriedade: number
): Promise<IAreaResponse | undefined> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        class: 'AreaService',
        method: 'atualizarAreaPorId',
        payload: {
          id,
          nome,
          descricao,
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

export async function deletarArea(
  id: string
): Promise<IAreaResponse | undefined> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        class: 'AreaService',
        method: 'deletarAreaPorId',
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
