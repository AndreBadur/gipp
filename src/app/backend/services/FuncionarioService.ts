import prisma from '@/lib/prisma'
import { tipo_custo_funcionario } from '@/generated/prisma'
import { isDataNullOrUndefined } from '../utils/verifications'

const FUNCIONARIO_CACHE_TTL_MS = 60_000

type FuncionarioCacheEntry = {
  dataConnection: unknown
  expiresAt: number
}

const funcionarioCache = new Map<string, FuncionarioCacheEntry>()

const getCachedFuncionario = (cacheKey: string) => {
  const cached = funcionarioCache.get(cacheKey)

  if (!cached) return null

  const isExpired = Date.now() > cached.expiresAt
  if (isExpired) {
    funcionarioCache.delete(cacheKey)
    return null
  }

  return cached.dataConnection
}

const setCachedFuncionario = (cacheKey: string, dataConnection: unknown) => {
  funcionarioCache.set(cacheKey, {
    dataConnection,
    expiresAt: Date.now() + FUNCIONARIO_CACHE_TTL_MS,
  })
}

const clearFuncionarioCache = () => {
  funcionarioCache.clear()
}

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
    clearFuncionarioCache()
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
    const cacheKey = `propriedade:${Number(id_proprietario)}:${Number(id_propriedade)}`

    const cachedData = getCachedFuncionario(cacheKey)
    if (cachedData) {
      return { dataConnection: cachedData, status: 200 }
    }

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
    setCachedFuncionario(cacheKey, dataConnection)
    return { dataConnection, status: 200 }
  }

  async buscarTodosFuncionariosDoProprietario(data: IFuncionario) {
    const { id_proprietario } = data
    const cacheKey = `proprietario:${Number(id_proprietario)}`

    const cachedData = getCachedFuncionario(cacheKey)
    if (cachedData) {
      return { dataConnection: cachedData, status: 200 }
    }

    const dataConnection = await prisma.funcionario.findMany({
      where: {
        id_proprietario: Number(id_proprietario),
      },
      orderBy: {
        nome: 'asc',
      },
    })

    isDataNullOrUndefined(dataConnection)
    setCachedFuncionario(cacheKey, dataConnection)
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
    clearFuncionarioCache()
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
    clearFuncionarioCache()
    return { dataConnection, status: 201 }
  }
}
