import { NextResponse } from 'next/server'
import { isDataNullOrUndefined } from '../utils/verifications'
import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

interface IUsuario {
  id: number
  email: string
  senha: string
  chave_senha: string
  telefone: string
}

export class UsuarioService {
  async buscarUsuarioPorEmail(data: IUsuario) {
    const { email, senha } = data
    try {
      const user = await prisma.usuario.findUnique({
        where: {
          email: email,
          AND: {
            senha,
          },
        },
      })

      isDataNullOrUndefined(user)
      console.log(`USER USUARIO SERVICE: ${JSON.stringify(user)}`)
      return NextResponse.json(user, { status: 200 })
    } catch (error) {
      console.log('im here in this error to tell you the truth')
      throw error
    }
  }

  async criarUsuario(data: IUsuario) {
    console.log('cheguei até no criarUsuario')
    const { email, senha, telefone, chave_senha = '0' } = data
    try {
      const request = await prisma.usuario.create({
        data: {
          email,
          senha,
          telefone,
          chave_senha,
        },
      })

      isDataNullOrUndefined(request)

      return NextResponse.json(data, { status: 201 })
    } catch (error) {
      throw error
    }
  }

  async deletarUsuario(data: IUsuario) {
    const { email } = data
    try {
      const request = await prisma.usuario.delete({
        where: {
          email,
        },
      })

      isDataNullOrUndefined(request)

      return NextResponse.json(data, { status: 201 })
    } catch (error) {
      throw error
    }
  }
}
