import prisma from '@/lib/prisma'
import { isDataNullOrUndefined } from '../utils/verifications'

export interface IArea {
  id?: number
  nome: string
  descricao?: string
  id_propriedade: number
}

export class AreaService {
  async criarArea(data: IArea) {
    const { nome, descricao, id_propriedade } = data

    const dataConnection = await prisma.area.create({
      data: {
        nome,
        descricao,
        id_propriedade,
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 201 }
  }

  async buscarAreaPorId(data: IArea) {
    const { id, id_propriedade } = data

    const dataConnection = await prisma.area.findFirst({
      where: {
        id: Number(id),
        id_propriedade: Number(id_propriedade),
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 200 }
  }

  async buscarTodasAreas(data: IArea) {
    const { id_propriedade } = data

    const dataConnection = await prisma.area.findMany({
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

  async atualizarAreaPorId(data: IArea) {
    const { id, nome, descricao, id_propriedade } = data

    const dataConnection = await prisma.area.update({
      data: {
        nome,
        descricao,
        id_propriedade,
      },
      where: {
        id: Number(id),
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 201 }
  }

  async deletarAreaPorId(data: IArea) {
    const { id } = data

    const dataConnection = await prisma.area.delete({
      where: {
        id: Number(id),
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 201 }
  }
}
