import { PrismaClient } from '@/generated/prisma'
import { isDataNullOrUndefined } from '../utils/verifications'

const prisma = new PrismaClient()

export interface IProprietario {
  id?: number
  registro: string
  cep: string
  endereco: string
  numero: string
  email: string
  nome: string
}

export class ProprietarioService {
  async criarProprietario(data: IProprietario) {
    const { registro, cep, endereco, numero, email, nome } = data

    const dataConnection = await prisma.proprietario.create({
      data: {
        registro,
        cep,
        endereco,
        numero,
        email,
        nome,
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 201 }
  }

  async buscarProprietarioPorEmail(data: IProprietario) {
    const { email } = data

    const dataConnection = await prisma.proprietario.findUnique({
      where: {
        email,
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 200 }
  }

  async atualizarProprietarioPorEmail(data: IProprietario) {
    const { registro, cep, endereco, numero, email, nome } = data

    const dataConnection = await prisma.proprietario.update({
      data: {
        registro,
        cep,
        endereco,
        numero,
        nome,
      },
      where: {
        email,
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 200 }
  }

  async deletarProprietarioPorEmail(data: IProprietario) {
    const { email } = data

    const dataConnection = await prisma.proprietario.delete({
      where: {
        email,
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 200 }
  }
}
