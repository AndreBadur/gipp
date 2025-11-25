import { PrismaClient, tipo_custo_funcionario } from '@/generated/prisma'
import { isDataNullOrUndefined } from '../utils/verifications'

const prisma = new PrismaClient()

export interface IFuncionario {
  id?: number
  nome: string
  email: string
  cpf: string
  data_nascimento: Date
  cargo: string
  custo: number
  tipo_custo: tipo_custo_funcionario
  conta_bancaria: string
  id_proprietario: number
  id_propriedade: number
}

export class FuncionarioService {
  async criarFuncionario(data: IFuncionario) {
    const {
      nome,
      email,
      cpf,
      data_nascimento,
      cargo,
      custo,
      tipo_custo,
      conta_bancaria,
      id_proprietario,
      id_propriedade,
    } = data

    const dataConnection = await prisma.funcionario.create({
      data: {
        nome,
        email,
        cpf,
        data_nascimento,
        cargo,
        custo,
        tipo_custo,
        conta_bancaria,
        id_proprietario,
        id_propriedade,
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

  async buscarTodosFuncionariosDaPropriedade(data: IFuncionario) {
    const { id_propriedade, id_proprietario } = data

    const dataConnection = await prisma.funcionario.findMany({
      where: {
        id_propriedade: Number(id_propriedade),
        id_proprietario: Number(id_proprietario),
      },
      orderBy: {
        nome: 'asc',
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 200 }
  }

  async buscarTodosFuncionariosDoProprietario(data: IFuncionario) {
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
      cpf,
      data_nascimento,
      cargo,
      custo,
      tipo_custo,
      conta_bancaria,
      id_proprietario,
      id_propriedade,
    } = data

    const dataConnection = await prisma.funcionario.update({
      data: {
        nome,
        email,
        cpf,
        data_nascimento,
        cargo,
        custo,
        tipo_custo,
        conta_bancaria,
        id_proprietario,
        id_propriedade,
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
