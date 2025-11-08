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
    const { id } = data

    const maquinario = await prisma.maquinario.findUnique({
      where: {
        id,
      },
    })

    isDataNullOrUndefined(maquinario)
    return { data: maquinario, status: 200 }
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

    const maquinario = await prisma.maquinario.update({
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
        id,
      },
    })

    isDataNullOrUndefined(maquinario)
    return { data: maquinario, status: 201 }
  }

  async deletarMaquinarioPorId(data: IMaquinario) {
    const { id } = data

    const maquinario = await prisma.maquinario.delete({
      where: {
        id,
      },
    })

    isDataNullOrUndefined(maquinario)
    return { data: maquinario, status: 201 }
  }
}
