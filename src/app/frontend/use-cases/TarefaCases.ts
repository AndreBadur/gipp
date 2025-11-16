import {
  IAreaTarefa,
  IRecursoTarefa,
  ITarefa,
} from '@/app/backend/services/TarefaService'
import { verifyApiResponse } from '../lib/tools'

export interface ITarefaResponse {
  success: boolean
  data: {
    dataConnection: ITarefa
    status: number
  }
}

export interface IListaTarefasResponse {
  success: boolean
  data: {
    dataConnection: ITarefa[]
    status: number
  }
}

export interface IAreaTarefaResponse {
  success: boolean
  data: {
    dataConnection: IAreaTarefa | IAreaTarefa[]
    status: number
  }
}

export interface IRecursoTarefaResponse {
  success: boolean
  data: {
    dataConnection: IRecursoTarefa | IRecursoTarefa[]
    status: number
  }
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  'http://localhost:3000/api/routeHandler'

export async function criarTarefa(
  titulo: string,
  descricao: string | undefined,
  data_inicio: Date | undefined,
  dias_uteis: number | undefined,
  horas_trabalho: number | undefined,
  status: ITarefa['status'],
  prioridade: ITarefa['prioridade'],
  tarefa_pai: number | undefined,
  id_propriedade: number
): Promise<ITarefaResponse | undefined> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        class: 'TarefaService',
        method: 'criarTarefa',
        payload: {
          titulo,
          descricao,
          data_inicio: data_inicio?.toISOString(),
          dias_uteis,
          horas_trabalho,
          status,
          prioridade,
          tarefa_pai,
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

export async function buscarTarefaPorIdEPropriedade(
  id: string,
  id_propriedade: number
): Promise<ITarefaResponse | undefined> {
  try {
    const params = new URLSearchParams({
      class: 'TarefaService',
      method: 'buscarTarefaPorId',
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

export async function buscarTodasTarefas(
  id_propriedade: number
): Promise<IListaTarefasResponse | undefined> {
  try {
    const params = new URLSearchParams({
      class: 'TarefaService',
      method: 'buscarTodasTarefas',
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

export async function atualizarTarefaPorId(
  id: string,
  titulo: string,
  descricao: string | undefined,
  data_inicio: Date | undefined,
  dias_uteis: number | undefined,
  horas_trabalho: number | undefined,
  status: ITarefa['status'],
  prioridade: ITarefa['prioridade'],
  tarefa_pai: number | undefined,
  id_propriedade: number
): Promise<ITarefaResponse | undefined> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        class: 'TarefaService',
        method: 'atualizarTarefaPorId',
        payload: {
          id,
          titulo,
          descricao,
          data_inicio: data_inicio?.toISOString(),
          dias_uteis,
          horas_trabalho,
          status,
          prioridade,
          tarefa_pai,
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

export async function deletarTarefa(
  id: string
): Promise<ITarefaResponse | undefined> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        class: 'TarefaService',
        method: 'deletarTarefaPorId',
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

export async function adicionarAreaTarefa(
  id_area: number,
  id_tarefa: number
): Promise<IAreaTarefaResponse | undefined> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        class: 'TarefaService',
        method: 'adicionarAreaTarefa',
        payload: {
          id_area,
          id_tarefa,
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

export async function listarAreasDaTarefa(
  id_tarefa: number
): Promise<IAreaTarefaResponse | undefined> {
  try {
    const params = new URLSearchParams({
      class: 'TarefaService',
      method: 'listarAreasDaTarefa',
      id_tarefa: id_tarefa.toString(),
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

export async function removerAreaTarefaPorId(
  id: number,
  id_tarefa: number
): Promise<IAreaTarefaResponse | undefined> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        class: 'TarefaService',
        method: 'removerAreaTarefaPorId',
        payload: {
          id,
          id_tarefa,
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

export async function adicionarRecursoTarefa(
  id_recurso: number,
  tipo_recurso: IRecursoTarefa['tipo_recurso'],
  quantidade: number,
  status_lancamento: boolean,
  id_tarefa: number
): Promise<IRecursoTarefaResponse | undefined> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        class: 'TarefaService',
        method: 'adicionarRecursoTarefa',
        payload: {
          id_recurso,
          tipo_recurso,
          quantidade,
          status_lancamento,
          id_tarefa,
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

export async function listarRecursosDaTarefa(
  id_tarefa: number
): Promise<IRecursoTarefaResponse | undefined> {
  try {
    const params = new URLSearchParams({
      class: 'TarefaService',
      method: 'listarRecursosDaTarefa',
      id_tarefa: id_tarefa.toString(),
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

export async function deletarRecursoDaTarefa(
  id: number,
  id_tarefa: number
): Promise<IRecursoTarefaResponse | undefined> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        class: 'TarefaService',
        method: 'deletarRecursoDaTarefa',
        payload: {
          id,
          id_tarefa,
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
