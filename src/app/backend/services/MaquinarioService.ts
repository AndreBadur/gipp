import { PrismaClient } from '@/generated/prisma'
import { isDataNullOrUndefined } from '../utils/verifications'

const prisma = new PrismaClient()

export interface IMaquinario {
  id?: number
  modelo: string
  ano_fabricacao: number
  custo: number
  tipo_custo: 'hora' | 'diario' | 'mensal'
  ultima_manutencao: Date
  alugado: boolean
  id_proprietario: number
  id_propriedade: number
}

export class MaquinarioService {
  async criarMaquinario(data: IMaquinario) {
    const {
      modelo,
      ano_fabricacao,
      custo,
      tipo_custo,
      ultima_manutencao,
      alugado,
      id_proprietario,
    } = data

    const dataConnection = await prisma.maquinario.create({
      data: {
        modelo,
        ano_fabricacao,
        custo,
        tipo_custo,
        ultima_manutencao,
        alugado,
        id_proprietario,
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 201 }
  }

  async buscarMaquinarioPorId(data: IMaquinario) {
    const { id, id_proprietario } = data

    const dataConnection = await prisma.maquinario.findFirst({
      where: {
        id: Number(id),
        id_proprietario: Number(id_proprietario),
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 200 }
  }

  async buscarTodosMaquinarios(data: IMaquinario) {
    const { id_proprietario } = data

    const dataConnection = await prisma.maquinario.findMany({
      where: {
        id_proprietario: Number(id_proprietario),
      },
      orderBy: {
        modelo: 'asc',
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 200 }
  }

  async atualizarMaquinarioPorId(data: IMaquinario) {
    const {
      id,
      modelo,
      ano_fabricacao,
      custo,
      tipo_custo,
      ultima_manutencao,
      alugado,
      id_proprietario,
    } = data

    const dataConnection = await prisma.maquinario.update({
      data: {
        modelo,
        ano_fabricacao,
        custo,
        tipo_custo,
        ultima_manutencao,
        alugado,
        id_proprietario,
      },
      where: {
        id: Number(id),
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 201 }
  }

  async deletarMaquinarioPorId(data: IMaquinario) {
    const { id } = data

    const dataConnection = await prisma.maquinario.delete({
      where: {
        id: Number(id),
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 201 }
  }

  async buscarMaquinariosDaPropriedade(data: IMaquinario) {
    const { id_proprietario, id_propriedade } = data

    const dataConnection = await prisma.maquinario.findMany({
      where: {
        id_proprietario: Number(id_proprietario),
        id_propriedade: Number(id_propriedade),
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 200 }
  }
}
