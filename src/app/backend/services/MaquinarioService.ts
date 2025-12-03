import prisma from '@/lib/prisma'
import { isDataNullOrUndefined } from '../utils/verifications'

const MAQUINARIO_CACHE_TTL_MS = 60_000

type MaquinarioCacheEntry = {
  dataConnection: unknown
  expiresAt: number
}

const maquinarioCache = new Map<string, MaquinarioCacheEntry>()

const getCachedMaquinario = (cacheKey: string) => {
  const cached = maquinarioCache.get(cacheKey)

  if (!cached) return null

  const isExpired = Date.now() > cached.expiresAt
  if (isExpired) {
    maquinarioCache.delete(cacheKey)
    return null
  }

  return cached.dataConnection
}

const setCachedMaquinario = (cacheKey: string, dataConnection: unknown) => {
  maquinarioCache.set(cacheKey, {
    dataConnection,
    expiresAt: Date.now() + MAQUINARIO_CACHE_TTL_MS,
  })
}

const clearMaquinarioCache = () => {
  maquinarioCache.clear()
}

export interface IMaquinario {
  id?: number
  modelo: string
  ano_fabricacao: number
  custo: number
  tipo_custo: 'hora' | 'diario' | 'mensal'
  ultima_manutencao: Date
  alugado: boolean
  id_proprietario: number
  id_propriedade: number
}

export class MaquinarioService {
  async criarMaquinario(data: IMaquinario) {
    const {
      modelo,
      ano_fabricacao,
      custo,
      tipo_custo,
      ultima_manutencao,
      alugado,
      id_proprietario,
      id_propriedade,
    } = data

    const dataConnection = await prisma.maquinario.create({
      data: {
        modelo,
        ano_fabricacao,
        custo,
        tipo_custo,
        ultima_manutencao,
        alugado,
        id_proprietario,
        id_propriedade,
      },
    })

    isDataNullOrUndefined(dataConnection)
    clearMaquinarioCache()
    return { dataConnection, status: 201 }
  }

  async buscarMaquinarioPorId(data: IMaquinario) {
    const { id, id_proprietario } = data

    const dataConnection = await prisma.maquinario.findFirst({
      where: {
        id: Number(id),
        id_proprietario: Number(id_proprietario),
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 200 }
  }

  async buscarTodosMaquinarios(data: IMaquinario) {
    const { id_proprietario } = data
    const cacheKey = `proprietario:${Number(id_proprietario)}`

    const cachedData = getCachedMaquinario(cacheKey)
    if (cachedData) {
      return { dataConnection: cachedData, status: 200 }
    }

    const dataConnection = await prisma.maquinario.findMany({
      where: {
        id_proprietario: Number(id_proprietario),
      },
      orderBy: {
        modelo: 'asc',
      },
    })

    isDataNullOrUndefined(dataConnection)
    setCachedMaquinario(cacheKey, dataConnection)
    return { dataConnection, status: 200 }
  }

  async atualizarMaquinarioPorId(data: IMaquinario) {
    const {
      id,
      modelo,
      ano_fabricacao,
      custo,
      tipo_custo,
      ultima_manutencao,
      alugado,
      id_proprietario,
      id_propriedade,
    } = data

    const dataConnection = await prisma.maquinario.update({
      data: {
        modelo,
        ano_fabricacao,
        custo,
        tipo_custo,
        ultima_manutencao,
        alugado,
        id_proprietario,
        id_propriedade,
      },
      where: {
        id: Number(id),
      },
    })

    isDataNullOrUndefined(dataConnection)
    clearMaquinarioCache()
    return { dataConnection, status: 201 }
  }

  async deletarMaquinarioPorId(data: IMaquinario) {
    const { id } = data

    const dataConnection = await prisma.maquinario.delete({
      where: {
        id: Number(id),
      },
    })

    isDataNullOrUndefined(dataConnection)
    clearMaquinarioCache()
    return { dataConnection, status: 201 }
  }

  async buscarMaquinariosDaPropriedade(data: IMaquinario) {
    const { id_proprietario, id_propriedade } = data
    const cacheKey = `propriedade:${Number(id_proprietario)}:${Number(id_propriedade)}`

    const cachedData = getCachedMaquinario(cacheKey)
    if (cachedData) {
      return { dataConnection: cachedData, status: 200 }
    }

    const dataConnection = await prisma.maquinario.findMany({
      where: {
        id_proprietario: Number(id_proprietario),
        id_propriedade: Number(id_propriedade),
      },
    })

    isDataNullOrUndefined(dataConnection)
    setCachedMaquinario(cacheKey, dataConnection)
    return { dataConnection, status: 200 }
  }
}
