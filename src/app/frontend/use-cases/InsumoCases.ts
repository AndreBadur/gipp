import { IInsumo } from '@/app/backend/services/InsumoService'
import { verifyApiResponse } from '../lib/tools'

export interface IInsumoResponse {
  success: boolean
  data: {
    dataConnection: IInsumo
    status: number
  }
}

export interface IListaInsumosResponse {
  success: boolean
  data: {
    dataConnection: IInsumo[]
    status: number
  }
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  'http://localhost:3000/api/routeHandler'

export async function criarInsumo(
  nome: string,
  quantidade: number,
  custo: number,
  unidade_medida: string,
  id_propriedade: number,
  id_fornecedor?: number
): Promise<IInsumoResponse | undefined> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        class: 'InsumoService',
        method: 'criarInsumo',
        payload: {
          nome,
          quantidade,
          custo,
          unidade_medida,
          id_propriedade,
          id_fornecedor,
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

export async function buscarInsumoPorId(
  id: string,
  id_propriedade: number
): Promise<IInsumoResponse | undefined> {
  try {
    const params = new URLSearchParams({
      class: 'InsumoService',
      method: 'buscarInsumoPorId',
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

export async function buscarTodosInsumos(
  id_propriedade: number
): Promise<IListaInsumosResponse | undefined> {
  try {
    const params = new URLSearchParams({
      class: 'InsumoService',
      method: 'buscarTodosInsumos',
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

export async function atualizarInsumoPorId(
  id: string,
  nome: string,
  quantidade: number,
  custo: number,
  unidade_medida: string,
  id_propriedade: number,
  id_fornecedor?: number
): Promise<IInsumoResponse | undefined> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        class: 'InsumoService',
        method: 'atualizarInsumoPorId',
        payload: {
          id,
          nome,
          quantidade,
          custo,
          unidade_medida,
          id_propriedade,
          id_fornecedor,
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

export async function deletarInsumo(
  id: string
): Promise<IInsumoResponse | undefined> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        class: 'InsumoService',
        method: 'deletarInsumoPorId',
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
