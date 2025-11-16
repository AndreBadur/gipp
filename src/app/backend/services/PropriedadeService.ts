import { PrismaClient } from '@/generated/prisma'
import { isDataNullOrUndefined } from '../utils/verifications'

const prisma = new PrismaClient()

export interface IPropriedade {
  id?: number
  endereco: string
  gerente?: string
  cnpj?: string
  id_proprietario: number
}

export class PropriedadeService {
  async criarPropriedade(data: IPropriedade) {
    const { endereco, gerente, cnpj, id_proprietario } = data

    const dataConnection = await prisma.propriedade.create({
      data: {
        endereco,
        gerente,
        cnpj,
        id_proprietario,
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 201 }
  }

  async buscarPropriedadePorId(data: IPropriedade) {
    const { id, id_proprietario } = data

    const dataConnection = await prisma.propriedade.findFirst({
      where: {
        id: Number(id),
        id_proprietario: Number(id_proprietario),
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 200 }
  }

  async buscarTodasPropriedades(data: IPropriedade) {
    const { id_proprietario } = data

    const dataConnection = await prisma.propriedade.findMany({
      where: {
        id_proprietario: Number(id_proprietario),
      },
      orderBy: {
        endereco: 'asc',
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 200 }
  }

  async atualizarPropriedadePorId(data: IPropriedade) {
    const { id, endereco, gerente, cnpj, id_proprietario } = data

    const dataConnection = await prisma.propriedade.update({
      data: {
        endereco,
        gerente,
        cnpj,
        id_proprietario,
      },
      where: {
        id: Number(id),
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 201 }
  }

  async deletarPropriedadePorId(data: IPropriedade) {
    const { id } = data

    const dataConnection = await prisma.propriedade.delete({
      where: {
        id: Number(id),
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 201 }
  }
}
