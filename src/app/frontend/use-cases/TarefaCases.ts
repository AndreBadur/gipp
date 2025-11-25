import {
  IAreaTarefa,
  IRecursoTarefa,
  ITarefa,
} from '@/app/backend/services/TarefaService'
import { verifyApiResponse } from '../lib/tools'
import { buscarTodosMaquinariosDaPropriedade } from './MaquinarioCases'
import { buscarTodosFuncionariosDaPropriedade } from './FuncionarioCases'
import {
  atualizarInsumoPorId,
  buscarInsumoPorId,
  buscarTodosInsumos,
} from './InsumoCases'
import { IMaquinario } from '@/app/backend/services/MaquinarioService'
import { IFuncionario } from '@/app/backend/services/FuncionarioService'
import { IInsumo } from '@/app/backend/services/InsumoService'
import { criarLancamento } from './LancamentoCases'

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
    dataConnection: IAreaTarefa[]
    status: number
  }
}

export interface IRecursoTarefaResponse {
  success: boolean
  data: {
    dataConnection: IRecursoTarefa[]
    status: number
  }
}

export interface IListaDeRecursosResponse {
  maquinarios: IMaquinario[]
  funcionarios: IFuncionario[]
  insumos: IInsumo[]
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
  data: IAreaTarefa[]
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
        payload: [data],
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
  data: IAreaTarefa[]
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
        payload: [data],
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
  data: IRecursoTarefa[]
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
        payload: [data],
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

export async function removerRecursoDaTarefa(
  data: IRecursoTarefa[]
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
        payload: [data],
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

export async function buscarTodosRecursos(
  id_propriedade: number,
  id_proprietario: number
): Promise<IListaDeRecursosResponse> {
  const maquinarios = await buscarTodosMaquinariosDaPropriedade(
    id_proprietario,
    id_propriedade
  )
  const funcionarios = await buscarTodosFuncionariosDaPropriedade(
    id_proprietario,
    id_propriedade
  )
  const insumos = await buscarTodosInsumos(id_propriedade)
  return {
    maquinarios: maquinarios?.data.dataConnection ?? [],
    funcionarios: funcionarios?.data.dataConnection ?? [],
    insumos: insumos?.data.dataConnection ?? [],
  }
}

export async function somaCustoTarefa(
  id_tarefa: string,
  id_propriedade: number,
  id_proprietario: number
) {
  const listaMaquinarioDaTarefa: number[] = []
  const listaFuncionarioDaTarefa: number[] = []
  const listaInsumosDaTarefa: { id_recurso: number; quantidade: number }[] = []
  const custoMaquinarios: number[] = []
  const custoFuncionarios: number[] = []
  const custoInsumos: number[] = []

  try {
    const tarefa = await buscarTarefaPorIdEPropriedade(
      id_tarefa,
      id_propriedade
    )
    const diasUteis = tarefa?.data?.dataConnection.dias_uteis
    const horasUteis = tarefa?.data?.dataConnection.horas_trabalho
    if (!diasUteis) {
      throw new Error('Não há dias úteis definidos na tarefa')
    }
    if (!horasUteis) {
      throw new Error('Não há horas úteis definidos na tarefa')
    }

    const listaRecursosDaTarefa = await listarRecursosDaTarefa(
      Number(id_tarefa)
    )
    const recursosDaTarefa = listaRecursosDaTarefa?.data.dataConnection ?? []
    recursosDaTarefa.map((data) => {
      if (data.tipo_recurso === 'maquinario') {
        listaMaquinarioDaTarefa.push(data.id_recurso)
      }
      if (data.tipo_recurso === 'funcionario') {
        listaFuncionarioDaTarefa.push(data.id_recurso)
      }
      if (data.tipo_recurso === 'insumo') {
        listaInsumosDaTarefa.push({
          id_recurso: data.id_recurso,
          quantidade: data.quantidade ?? 0,
        })
      }
    })

    const listaRecursosDoBD = await buscarTodosRecursos(
      id_propriedade,
      id_proprietario
    )
    listaRecursosDoBD.maquinarios.map((maquinario) => {
      if (listaMaquinarioDaTarefa.some((id) => Number(id) === maquinario.id)) {
        if (maquinario.tipo_custo !== 'mensal') {
          if (maquinario.tipo_custo === 'diario') {
            custoMaquinarios.push(maquinario.custo * diasUteis)
          }
          if (maquinario.tipo_custo === 'hora') {
            custoMaquinarios.push(maquinario.custo * (horasUteis * diasUteis))
          }
        }
      }
    })
    listaRecursosDoBD.funcionarios.map((funcionario) => {
      if (
        listaFuncionarioDaTarefa.some((id) => Number(id) === funcionario.id)
      ) {
        if (funcionario.tipo_custo !== 'mensal') {
          if (funcionario.tipo_custo === 'diaria') {
            custoFuncionarios.push(funcionario.custo * diasUteis)
          }
        }
      }
    })
    listaRecursosDoBD.insumos.map((insumo) => {
      listaInsumosDaTarefa.some((objInsumoQuantidade) => {
        if (Number(objInsumoQuantidade.id_recurso) === insumo.id) {
          custoInsumos.push(insumo.custo * objInsumoQuantidade.quantidade)
        }
      })
    })

    const custoTotal =
      custoMaquinarios.reduce((acc, n) => acc + n, 0) +
      custoFuncionarios.reduce((acc, n) => acc + n, 0) +
      custoInsumos.reduce((acc, n) => acc + n, 0)

    const result = {
      listaInsumosDaTarefa,
      custoMaquinarios,
      custoFuncionarios,
      custoInsumos,
      custoTotal,
    }

    return result
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export async function lancamentoDaTarefa(
  idTarefa: string,
  idPropriedade: number,
  idProprietario: number,
  centroCusto: number
) {
  let resultado
  const valores = await somaCustoTarefa(
    idTarefa,
    idPropriedade ?? 0,
    idProprietario ?? 0
  )

  resultado = valores?.listaInsumosDaTarefa.map(async (insumo) => {
    const insumoData = await buscarInsumoPorId(
      insumo.id_recurso.toString(),
      idPropriedade
    )
    const insumoValores = insumoData?.data.dataConnection
    resultado = await atualizarInsumoPorId(
      insumo.id_recurso.toString(),
      insumoValores?.nome ?? '',
      insumo.quantidade - (insumoValores?.quantidade ?? 0),
      insumoValores?.custo ?? 0,
      insumoValores?.unidade_medida ?? '',
      idPropriedade,
      insumoValores?.id_fornecedor
    )
  })
  const totalValor = valores?.custoTotal
  resultado = await criarLancamento(
    totalValor ?? 0,
    'entrada',
    new Date(),
    idPropriedade ?? 0,
    centroCusto
  )

  return resultado
}
