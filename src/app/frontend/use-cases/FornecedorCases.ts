import { IFornecedor } from '@/app/backend/services/FornecedorService'
import { verifyApiResponse } from '../lib/tools'

export interface IFornecedorResponse {
  success: boolean
  data: {
    dataConnection: IFornecedor
    status: number
  }
}

export interface IListaFornecedorsResponse {
  success: boolean
  data: {
    dataConnection: IFornecedor[]
    status: number
  }
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  'http://localhost:3000/api/routeHandler'

export async function criarFornecedor(
  nome: string,
  email: string,
  telefone: string,
  id_propriedade: number
): Promise<IFornecedorResponse | undefined> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        class: 'FornecedorService',
        method: 'criarFornecedor',
        payload: {
          nome,
          email,
          telefone,
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

export async function buscarFornecedorPorIdEPropriedade(
  id: string,
  id_propriedade: number
): Promise<IFornecedorResponse | undefined> {
  try {
    const params = new URLSearchParams({
      class: 'FornecedorService',
      method: 'buscarFornecedorPorId',
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

export async function buscarTodosFornecedores(
  id_propriedade: number
): Promise<IListaFornecedorsResponse | undefined> {
  try {
    const params = new URLSearchParams({
      class: 'FornecedorService',
      method: 'buscarTodosFornecedores',
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

export async function atualizarFornecedorPorId(
  id: string,
  nome: string,
  email: string,
  telefone: string,
  id_propriedade: number
): Promise<IFornecedorResponse | undefined> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        class: 'FornecedorService',
        method: 'atualizarFornecedorPorId',
        payload: {
          id,
          nome,
          email,
          telefone,
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

export async function deletarFornecedor(
  id: string
): Promise<IFornecedorResponse | undefined> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        class: 'FornecedorService',
        method: 'deletarFornecedorPorId',
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
