import { IProduto } from '@/app/backend/services/ProdutoService'
import { verifyApiResponse } from '../lib/tools'

export interface IProdutoResponse {
  success: boolean
  data: {
    dataConnection: IProduto
    status: number
  }
}

export interface IListaProdutosResponse {
  success: boolean
  data: {
    dataConnection: IProduto[]
    status: number
  }
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  'http://localhost:3000/api/routeHandler'

export async function criarProduto(
  nome: string,
  quantidade: number,
  custo: number,
  preco_venda: number,
  id_propriedade: number
): Promise<IProdutoResponse | undefined> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        class: 'ProdutoService',
        method: 'criarProduto',
        payload: {
          nome,
          quantidade,
          custo,
          preco_venda,
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

export async function buscarProdutoPorIdEPropriedade(
  id: string,
  id_propriedade: number
): Promise<IProdutoResponse | undefined> {
  try {
    const params = new URLSearchParams({
      class: 'ProdutoService',
      method: 'buscarProdutoPorId',
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

export async function buscarTodosProdutos(
  id_propriedade: number
): Promise<IListaProdutosResponse | undefined> {
  try {
    const params = new URLSearchParams({
      class: 'ProdutoService',
      method: 'buscarTodosProdutos',
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

export async function atualizarProdutoPorId(
  id: string,
  nome: string,
  quantidade: number,
  custo: number,
  preco_venda: number,
  id_propriedade: number
): Promise<IProdutoResponse | undefined> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        class: 'ProdutoService',
        method: 'atualizarProdutoPorId',
        payload: {
          id,
          nome,
          quantidade,
          custo,
          preco_venda,
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

export async function deletarProduto(
  id: string
): Promise<IProdutoResponse | undefined> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        class: 'ProdutoService',
        method: 'deletarProdutoPorId',
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
