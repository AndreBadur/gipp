import prisma from '@/lib/prisma'
import { isDataNullOrUndefined } from '../utils/verifications'

export interface IProduto {
  id?: number
  nome: string
  quantidade?: number
  custo?: number
  preco_venda?: number
  id_propriedade: number
}

export class ProdutoService {
  async criarProduto(data: IProduto) {
    const { nome, quantidade, custo, preco_venda, id_propriedade } = data

    const dataConnection = await prisma.produto.create({
      data: {
        nome,
        quantidade,
        custo,
        preco_venda,
        id_propriedade,
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 201 }
  }

  async buscarProdutoPorId(data: IProduto) {
    const { id, id_propriedade } = data

    const dataConnection = await prisma.produto.findFirst({
      where: {
        id: Number(id),
        id_propriedade: Number(id_propriedade),
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 200 }
  }

  async buscarTodosProdutos(data: IProduto) {
    const { id_propriedade } = data

    const dataConnection = await prisma.produto.findMany({
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

  async atualizarProdutoPorId(data: IProduto) {
    const { id, nome, quantidade, custo, preco_venda, id_propriedade } = data

    const dataConnection = await prisma.produto.update({
      data: {
        nome,
        quantidade,
        custo,
        preco_venda,
        id_propriedade,
      },
      where: {
        id: Number(id),
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 201 }
  }

  async deletarProdutoPorId(data: IProduto) {
    const { id } = data

    const dataConnection = await prisma.produto.delete({
      where: {
        id: Number(id),
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 201 }
  }
}
