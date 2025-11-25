import { IMaquinario } from '@/app/backend/services/MaquinarioService'
import { verifyApiResponse } from '../lib/tools'

export interface IMaquinarioResponse {
  success: boolean
  data: {
    dataConnection: IMaquinario
    status: number
  }
}

export interface IListaMaquinariosResponse {
  success: boolean
  data: {
    dataConnection: IMaquinario[]
    status: number
  }
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  'http://localhost:3000/api/routeHandler'

export async function criarMaquinario(
  modelo: string,
  ano_fabricacao: number,
  custo: number,
  tipo_custo: IMaquinario['tipo_custo'],
  ultima_manutencao: Date,
  alugado: boolean,
  id_proprietario: number,
  id_propriedade: number
): Promise<IMaquinarioResponse | undefined> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        class: 'MaquinarioService',
        method: 'criarMaquinario',
        payload: {
          modelo,
          ano_fabricacao,
          custo,
          tipo_custo,
          ultima_manutencao,
          alugado,
          id_proprietario,
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

export async function buscarMaquinarioPorIdEProprietario(
  id: string,
  idProprietario: number
): Promise<IMaquinarioResponse | undefined> {
  try {
    const params = new URLSearchParams({
      class: 'MaquinarioService',
      method: 'buscarMaquinarioPorId',
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

export async function buscarTodosMaquinariosDoProprietario(
  idProprietario: number
): Promise<IListaMaquinariosResponse | undefined> {
  try {
    const params = new URLSearchParams({
      class: 'MaquinarioService',
      method: 'buscarTodosMaquinarios',
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

export async function buscarTodosMaquinariosDaPropriedade(
  idProprietario: number,
  idPropriedade: number
): Promise<IListaMaquinariosResponse | undefined> {
  try {
    const params = new URLSearchParams({
      class: 'MaquinarioService',
      method: 'buscarMaquinariosDaPropriedade',
      id_proprietario: idProprietario.toString(),
      id_propriedade: idPropriedade.toString(),
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

export async function atualizarMaquinarioPorId(
  id: string,
  modelo: string,
  ano_fabricacao: number,
  custo: number,
  tipo_custo: IMaquinario['tipo_custo'],
  ultima_manutencao: Date,
  alugado: boolean,
  id_proprietario: number,
  id_propriedade: number
): Promise<IMaquinarioResponse | undefined> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        class: 'MaquinarioService',
        method: 'atualizarMaquinarioPorId',
        payload: {
          id,
          modelo,
          ano_fabricacao,
          custo,
          tipo_custo,
          ultima_manutencao: ultima_manutencao.toISOString(),
          alugado,
          id_proprietario,
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

export async function deletarMaquinario(
  id: string
): Promise<IMaquinarioResponse | undefined> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        class: 'MaquinarioService',
        method: 'deletarMaquinarioPorId',
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
