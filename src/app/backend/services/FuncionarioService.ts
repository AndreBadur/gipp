import { PrismaClient } from '@/generated/prisma'
import { isDataNullOrUndefined } from '../utils/verifications'

const prisma = new PrismaClient()

export interface IFuncionario {
  id?: number
  nome: string
  email: string
  conta_bancaria: string
  cpf: string
  pispasep: string
  carteira_trabalho: string
  data_nascimento: string
  genero: 'masculino' | 'feminino'
  certidao_nascimento: Buffer
  comprovante_residencia: Buffer
  comprovante_escolaridade: Buffer
  reservista: Buffer
  id_proprietario: number
}

export class FuncionarioService {
  async criarFuncionario(data: IFuncionario) {
    const {
      nome,
      email,
      conta_bancaria,
      cpf,
      pispasep,
      carteira_trabalho,
      data_nascimento,
      genero,
      certidao_nascimento,
      comprovante_residencia,
      comprovante_escolaridade,
      reservista,
      id_proprietario,
    } = data

    const dataConnection = await prisma.funcionario.create({
      data: {
        nome,
        email,
        conta_bancaria,
        cpf,
        pispasep,
        carteira_trabalho,
        data_nascimento,
        genero,
        certidao_nascimento,
        comprovante_residencia,
        comprovante_escolaridade,
        reservista,
        id_proprietario,
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 201 }
  }

  async buscarFuncionarioPorId(data: IFuncionario) {
    const { id, id_proprietario } = data

    const dataConnection = await prisma.funcionario.findFirst({
      where: {
        id: Number(id),
        id_proprietario: Number(id_proprietario),
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 200 }
  }

  async buscarTodosFuncionarios(data: IFuncionario) {
    const { id_proprietario } = data

    const dataConnection = await prisma.funcionario.findMany({
      where: {
        id_proprietario: Number(id_proprietario),
      },
      orderBy: {
        nome: 'asc',
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 200 }
  }

  async atualizarFuncionarioPorId(data: IFuncionario) {
    const {
      id,
      nome,
      email,
      conta_bancaria,
      cpf,
      pispasep,
      carteira_trabalho,
      data_nascimento,
      genero,
      certidao_nascimento,
      comprovante_residencia,
      comprovante_escolaridade,
      reservista,
      id_proprietario,
    } = data

    const dataConnection = await prisma.funcionario.update({
      data: {
        nome,
        email,
        conta_bancaria,
        cpf,
        pispasep,
        carteira_trabalho,
        data_nascimento,
        genero,
        certidao_nascimento,
        comprovante_residencia,
        comprovante_escolaridade,
        reservista,
        id_proprietario,
      },
      where: {
        id: Number(id),
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 201 }
  }

  async deletarFuncionarioPorId(data: IFuncionario) {
    const { id } = data

    const dataConnection = await prisma.funcionario.delete({
      where: {
        id: Number(id),
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 201 }
  }
}
