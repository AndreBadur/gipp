import { ILancamento } from '@/app/backend/services/LancamentoService'
import { verifyApiResponse } from '../lib/tools'

export interface ILancamentoResponse {
  success: boolean
  data: {
    dataConnection: ILancamento
    status: number
  }
}

export interface IListaLancamentosResponse {
  success: boolean
  data: {
    dataConnection: ILancamento[]
    status: number
  }
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  'http://localhost:3000/api/routeHandler'

export async function criarLancamento(
  valor: number,
  tipo_lancamento: ILancamento['tipo_lancamento'],
  data_lancamento: Date | undefined,
  id_propriedade: number,
  id_centro_custo?: number
): Promise<ILancamentoResponse | undefined> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        class: 'LancamentoService',
        method: 'criarLancamento',
        payload: {
          valor,
          tipo_lancamento,
          data_lancamento: data_lancamento?.toISOString(),
          id_propriedade,
          id_centro_custo,
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

export async function buscarLancamentoPorIdEPropriedade(
  id: string,
  id_propriedade: number
): Promise<ILancamentoResponse | undefined> {
  try {
    const params = new URLSearchParams({
      class: 'LancamentoService',
      method: 'buscarLancamentoPorId',
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

export async function buscarTodosLancamentos(
  id_propriedade: number
): Promise<IListaLancamentosResponse | undefined> {
  try {
    const params = new URLSearchParams({
      class: 'LancamentoService',
      method: 'buscarTodosLancamentos',
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

export async function deletarLancamento(
  id: string
): Promise<ILancamentoResponse | undefined> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        class: 'LancamentoService',
        method: 'deletarLancamentoPorId',
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
