import prisma from '@/lib/prisma'
import { isDataNullOrUndefined } from '../utils/verifications'

export interface IInsumo {
  id?: number
  nome: string
  quantidade: number
  custo: number
  unidade_medida: string
  id_propriedade: number
  id_fornecedor?: number
}

export class InsumoService {
  async criarInsumo(data: IInsumo) {
    const {
      nome,
      quantidade,
      custo,
      unidade_medida,
      id_propriedade,
      id_fornecedor,
    } = data

    const dataConnection = await prisma.insumo.create({
      data: {
        nome,
        quantidade,
        custo,
        unidade_medida,
        id_propriedade,
        id_fornecedor,
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 201 }
  }

  async buscarInsumoPorId(data: IInsumo) {
    const { id, id_propriedade } = data

    const dataConnection = await prisma.insumo.findFirst({
      where: {
        id: Number(id),
        id_propriedade: Number(id_propriedade),
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 200 }
  }

  async buscarTodosInsumos(data: IInsumo) {
    const { id_propriedade } = data

    const dataConnection = await prisma.insumo.findMany({
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

  async atualizarInsumoPorId(data: IInsumo) {
    const {
      id,
      nome,
      quantidade,
      custo,
      unidade_medida,
      id_propriedade,
      id_fornecedor,
    } = data

    const dataConnection = await prisma.insumo.update({
      data: {
        nome,
        quantidade,
        custo,
        unidade_medida,
        id_propriedade,
        id_fornecedor,
      },
      where: {
        id: Number(id),
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 201 }
  }

  async deletarInsumoPorId(data: IInsumo) {
    const { id } = data

    const dataConnection = await prisma.insumo.delete({
      where: {
        id: Number(id),
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 201 }
  }
}
