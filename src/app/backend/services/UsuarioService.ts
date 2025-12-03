import { isDataNullOrUndefined } from '../utils/verifications'
import prisma from '@/lib/prisma'

export interface IUsuario {
  id: number
  email: string
  senha: string
  chave_senha: string
  telefone: string
}

export class UsuarioService {
  async criarUsuario(data: IUsuario) {
    const { email, senha, telefone, chave_senha = '0' } = data

    const dataConnection = await prisma.usuario.create({
      data: {
        email,
        senha,
        telefone,
        chave_senha,
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 201 }
  }

  async buscarUsuarioPorEmail(data: IUsuario) {
    const { email, senha } = data

    const dataConnection = await prisma.usuario.findUnique({
      where: {
        email: email,
        AND: {
          senha,
        },
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 200 }
  }

  async deletarUsuario(data: IUsuario) {
    const { email } = data

    const dataConnection = await prisma.usuario.delete({
      where: {
        email,
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 201 }
  }
}
