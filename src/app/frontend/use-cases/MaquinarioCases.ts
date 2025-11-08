import { IMaquinario } from '@/app/backend/services/MaquinarioService'
import { verifyApiResponse } from '../lib/tools'

interface IMaquinarioResponse {
  success: boolean
  data: {
    data: IMaquinario
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
  id_proprietario: number
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
          ultima_manutencao: ultima_manutencao.toISOString(),
          alugado,
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

export async function buscarMaquinarioPorId(
  id: number
): Promise<IMaquinarioResponse | undefined> {
  if (!id || Number.isNaN(id)) {
    throw Error('id inválido na busca pelo maquinario')
  }

  try {
    const params = new URLSearchParams({
      class: 'MaquinarioService',
      method: 'buscarMaquinarioPorId',
      id: String(id),
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
  id: number,
  modelo: string,
  ano_fabricacao: number,
  custo: number,
  tipo_custo: IMaquinario['tipo_custo'],
  ultima_manutencao: Date,
  alugado: boolean,
  id_proprietario: number
): Promise<IMaquinarioResponse | undefined> {
  if (!id || Number.isNaN(id)) {
    throw Error('id inválido para atualização de maquinario')
  }

  try {
    const response = await fetch(API_BASE_URL, {
      method: 'PATCH',
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
  id: number
): Promise<IMaquinarioResponse | undefined> {
  if (!id || Number.isNaN(id)) {
    throw Error('id inválido para deletar maquinario')
  }

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
