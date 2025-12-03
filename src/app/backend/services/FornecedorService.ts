import prisma from '@/lib/prisma'
import { isDataNullOrUndefined } from '../utils/verifications'

export interface IFornecedor {
  id?: number
  nome: string
  email: string
  telefone: string
  id_propriedade: number
}

export class FornecedorService {
  async criarFornecedor(data: IFornecedor) {
    const { nome, email, telefone, id_propriedade } = data

    const dataConnection = await prisma.fornecedor.create({
      data: {
        nome,
        email,
        telefone,
        id_propriedade,
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 201 }
  }

  async buscarFornecedorPorId(data: IFornecedor) {
    const { id, id_propriedade } = data

    const dataConnection = await prisma.fornecedor.findFirst({
      where: {
        id: Number(id),
        id_propriedade: Number(id_propriedade),
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 200 }
  }

  async buscarTodosFornecedores(data: IFornecedor) {
    const { id_propriedade } = data

    const dataConnection = await prisma.fornecedor.findMany({
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

  async atualizarFornecedorPorId(data: IFornecedor) {
    const { id, nome, email, telefone, id_propriedade } = data

    const dataConnection = await prisma.fornecedor.update({
      data: {
        nome,
        email,
        telefone,
        id_propriedade,
      },
      where: {
        id: Number(id),
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 201 }
  }

  async deletarFornecedorPorId(data: IFornecedor) {
    const { id } = data

    const dataConnection = await prisma.fornecedor.delete({
      where: {
        id: Number(id),
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 201 }
  }
}
