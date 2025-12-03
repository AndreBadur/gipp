import prisma from '@/lib/prisma'
import { isDataNullOrUndefined } from '../utils/verifications'

export interface ILancamento {
  id?: number
  valor: number
  tipo_lancamento: 'entrada' | 'saida'
  data_lancamento?: Date
  id_propriedade: number
  id_centro_custo?: number
}

export class LancamentoService {
  async criarLancamento(data: ILancamento) {
    const {
      valor,
      tipo_lancamento,
      data_lancamento,
      id_propriedade,
      id_centro_custo,
    } = data

    const dataConnection = await prisma.lancamento.create({
      data: {
        valor,
        tipo_lancamento,
        data_lancamento,
        id_propriedade,
        id_centro_custo,
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 201 }
  }

  async buscarLancamentoPorId(data: ILancamento) {
    const { id, id_propriedade } = data

    const dataConnection = await prisma.lancamento.findFirst({
      where: {
        id: Number(id),
        id_propriedade: Number(id_propriedade),
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 200 }
  }

  async buscarTodosLancamentos(data: ILancamento) {
    const { id_propriedade } = data

    const dataConnection = await prisma.lancamento.findMany({
      where: {
        id_propriedade: Number(id_propriedade),
      },
      orderBy: {
        data_lancamento: 'desc',
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 200 }
  }

  async deletarLancamentoPorId(data: ILancamento) {
    const { id } = data

    const dataConnection = await prisma.lancamento.delete({
      where: {
        id: Number(id),
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 201 }
  }
}
