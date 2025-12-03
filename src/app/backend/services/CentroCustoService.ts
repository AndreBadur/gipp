import prisma from '@/lib/prisma'
import { isDataNullOrUndefined } from '../utils/verifications'

export interface ICentroCusto {
  id?: number
  nome: string
  id_propriedade: number
}

export class CentroCustoService {
  async criarCentroCusto(data: ICentroCusto) {
    const { nome, id_propriedade } = data

    const dataConnection = await prisma.centro_custo.create({
      data: {
        nome,
        id_propriedade,
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 201 }
  }

  async buscarCentroCustoPorId(data: ICentroCusto) {
    const { id, id_propriedade } = data

    const dataConnection = await prisma.centro_custo.findFirst({
      where: {
        id: Number(id),
        id_propriedade: Number(id_propriedade),
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 200 }
  }

  async buscarTodosCentrosDeCusto(data: ICentroCusto) {
    const { id_propriedade } = data

    const dataConnection = await prisma.centro_custo.findMany({
      where: {
        id_propriedade: Number(id_propriedade),
      },
      orderBy: {
        nome: 'asc',
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 200 }
  }

  async atualizarCentroCustoPorId(data: ICentroCusto) {
    const { id, nome, id_propriedade } = data

    const dataConnection = await prisma.centro_custo.update({
      data: {
        nome,
        id_propriedade,
      },
      where: {
        id: Number(id),
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 201 }
  }

  async deletarCentroCustoPorId(data: ICentroCusto) {
    const { id } = data

    const dataConnection = await prisma.centro_custo.delete({
      where: {
        id: Number(id),
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 201 }
  }
}
