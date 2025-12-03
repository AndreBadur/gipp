import prisma from '@/lib/prisma'
import { isDataNullOrUndefined } from '../utils/verifications'

const INSUMO_CACHE_TTL_MS = 60_000

type InsumoCacheEntry = {
  dataConnection: unknown
  expiresAt: number
}

const insumoCache = new Map<number, InsumoCacheEntry>()

const getCachedInsumos = (idPropriedade: number) => {
  const cached = insumoCache.get(idPropriedade)

  if (!cached) return null

  const isExpired = Date.now() > cached.expiresAt
  if (isExpired) {
    insumoCache.delete(idPropriedade)
    return null
  }

  return cached.dataConnection
}

const setCachedInsumos = (idPropriedade: number, dataConnection: unknown) => {
  insumoCache.set(idPropriedade, {
    dataConnection,
    expiresAt: Date.now() + INSUMO_CACHE_TTL_MS,
  })
}

const clearInsumoCache = () => {
  insumoCache.clear()
}

export interface IInsumo {
  id?: number
  nome: string
  quantidade: number
  custo: number
  unidade_medida: string
  id_propriedade: number
  id_fornecedor?: number
}

export class InsumoService {
  async criarInsumo(data: IInsumo) {
    const {
      nome,
      quantidade,
      custo,
      unidade_medida,
      id_propriedade,
      id_fornecedor,
    } = data

    const dataConnection = await prisma.insumo.create({
      data: {
        nome,
        quantidade,
        custo,
        unidade_medida,
        id_propriedade,
        id_fornecedor,
      },
    })

    isDataNullOrUndefined(dataConnection)
    clearInsumoCache()
    return { dataConnection, status: 201 }
  }

  async buscarInsumoPorId(data: IInsumo) {
    const { id, id_propriedade } = data

    const dataConnection = await prisma.insumo.findFirst({
      where: {
        id: Number(id),
        id_propriedade: Number(id_propriedade),
      },
    })

    isDataNullOrUndefined(dataConnection)
    return { dataConnection, status: 200 }
  }

  async buscarTodosInsumos(data: IInsumo) {
    const { id_propriedade } = data
    const propriedadeId = Number(id_propriedade)

    const cachedData = getCachedInsumos(propriedadeId)
    if (cachedData) {
      return { dataConnection: cachedData, status: 200 }
    }

    const dataConnection = await prisma.insumo.findMany({
      where: {
        id_propriedade: propriedadeId,
      },
      orderBy: {
        nome: 'asc',
      },
    })

    isDataNullOrUndefined(dataConnection)
    setCachedInsumos(propriedadeId, dataConnection)
    return { dataConnection, status: 200 }
  }

  async atualizarInsumoPorId(data: IInsumo) {
    const {
      id,
      nome,
      quantidade,
      custo,
      unidade_medida,
      id_propriedade,
      id_fornecedor,
    } = data

    const dataConnection = await prisma.insumo.update({
      data: {
        nome,
        quantidade,
        custo,
        unidade_medida,
        id_propriedade,
        id_fornecedor,
      },
      where: {
        id: Number(id),
      },
    })

    isDataNullOrUndefined(dataConnection)
    clearInsumoCache()
    return { dataConnection, status: 201 }
  }

  async deletarInsumoPorId(data: IInsumo) {
    const { id } = data

    const dataConnection = await prisma.insumo.delete({
      where: {
        id: Number(id),
      },
    })

    isDataNullOrUndefined(dataConnection)
    clearInsumoCache()
    return { dataConnection, status: 201 }
  }
}
