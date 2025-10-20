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

    try {
      const data = await prisma.proprietario.create({
        data: {
          registro,
          cep,
          endereco,
          numero,
          email,
          nome,
        },
      })

      isDataNullOrUndefined(data)
      return { data, status: 201 }
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async buscarProprietarioPorEmail(data: IProprietario) {
    const { email } = data

    try {
      const data = await prisma.proprietario.findUnique({
        where: {
          email,
        },
      })

      isDataNullOrUndefined(data)
      return { data, status: 200 }
    } catch (error) {
      throw error
    }
  }

  async atualizarProprietarioPorEmail(data: IProprietario) {
    const { registro, cep, endereco, numero, email, nome } = data

    try {
      const data = await prisma.proprietario.update({
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

      isDataNullOrUndefined(data)
      return { data, status: 200 }
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async deletarProprietarioPorEmail(data: IProprietario) {
    const { email } = data

    try {
      const data = await prisma.proprietario.delete({
        where: {
          email,
        },
      })

      isDataNullOrUndefined(data)
      return { data, status: 200 }
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}
