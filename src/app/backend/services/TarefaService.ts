import { PrismaClient } from '@/generated/prisma'
import { isDataNullOrUndefined } from '../utils/verifications'

const prisma = new PrismaClient()

export interface ITarefa {
  id?: number
  titulo: string
  descricao?: string
  data_inicio?: Date
  dias_uteis?: number
  horas_trabalho?: number
  status: 'a_fazer' | 'fazendo' | 'validando' | 'entregue'
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente'
  tarefa_pai?: number
  id_propriedade: number
}

export interface IAreaTarefa {
  id: number
  id_area: number
  id_tarefa: number
}

export interface IRecursoTarefa {
  id: number
  id_recurso: number
  tipo_recurso: 'maquinario' | 'funcionario' | 'insumo'
  quantidade: number
  status_lancamento: boolean
  id_tarefa: number
}

export class TarefaService {
  async criarTarefa(data: ITarefa) {
    const {
      titulo,
      descricao,
      data_inicio,
      dias_uteis,
      horas_trabalho,
      status,
      prioridade,
      tarefa_pai,
      id_propriedade,
    } = data

    const dataConnection = await prisma.tarefa.create({
      data: {
        titulo,
        descricao,
        data_inicio,
        dias_uteis,
        horas_trabalho,
        status,
        prioridade,
        tarefa_pai,
        id_propriedade,
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 201 }
  }

  async buscarTarefaPorId(data: ITarefa) {
    const { id, id_propriedade } = data

    const dataConnection = await prisma.tarefa.findFirst({
      where: {
        id: Number(id),
        id_propriedade: Number(id_propriedade),
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 200 }
  }

  async buscarTodasTarefas(data: ITarefa) {
    const { id_propriedade } = data

    const dataConnection = await prisma.tarefa.findMany({
      where: {
        id_propriedade: Number(id_propriedade),
      },
      orderBy: {
        data_inicio: 'desc',
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 200 }
  }

  async atualizarTarefaPorId(data: ITarefa) {
    const {
      id,
      titulo,
      descricao,
      data_inicio,
      dias_uteis,
      horas_trabalho,
      status,
      prioridade,
      tarefa_pai,
      id_propriedade,
    } = data

    const dataConnection = await prisma.tarefa.update({
      data: {
        titulo,
        descricao,
        data_inicio,
        dias_uteis,
        horas_trabalho,
        status,
        prioridade,
        tarefa_pai,
        id_propriedade,
      },
      where: {
        id: Number(id),
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 201 }
  }

  async deletarTarefaPorId(data: ITarefa) {
    const { id } = data

    const dataConnection = await prisma.tarefa.delete({
      where: {
        id: Number(id),
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 201 }
  }

  async adicionarAreaTarefa(data: IAreaTarefa) {
    const { id_area, id_tarefa } = data

    const dataConnection = await prisma.area_tarefa.create({
      data: {
        id_area,
        id_tarefa,
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 201 }
  }

  async listarAreasDaTarefa(data: IAreaTarefa) {
    const { id_tarefa } = data

    const dataConnection = await prisma.area_tarefa.findMany({
      where: {
        id_tarefa: Number(id_tarefa),
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 200 }
  }

  async removerAreaTarefaPorId(data: IAreaTarefa) {
    const { id, id_tarefa } = data

    const dataConnection = await prisma.area_tarefa.delete({
      where: {
        id: Number(id),
        id_tarefa: Number(id_tarefa),
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 201 }
  }

  async adicionarRecursoTarefa(data: IRecursoTarefa) {
    const {
      id_recurso,
      quantidade,
      status_lancamento,
      tipo_recurso,
      id_tarefa,
    } = data

    const dataConnection = await prisma.recurso_tarefa.create({
      data: {
        id_recurso,
        quantidade,
        status_lancamento,
        tipo_recurso,
        id_tarefa,
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 201 }
  }

  async listarRecursosDaTarefa(data: IRecursoTarefa) {
    const { id_tarefa } = data

    const dataConnection = await prisma.recurso_tarefa.findMany({
      where: {
        id_tarefa,
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 201 }
  }

  async deletarRecursoDaTarefa(data: IRecursoTarefa) {
    const { id, id_tarefa } = data

    const dataConnection = await prisma.recurso_tarefa.delete({
      where: {
        id: Number(id),
        id_tarefa: Number(id_tarefa),
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 201 }
  }
}
