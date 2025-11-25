import { IFuncionario } from '@/app/backend/services/FuncionarioService'
import { verifyApiResponse } from '../lib/tools'
import { tipo_custo_funcionario } from '@/generated/prisma'

export interface IFuncionarioResponse {
  success: boolean
  data: {
    dataConnection: IFuncionario
    status: number
  }
}

export interface IListaFuncionariosResponse {
  success: boolean
  data: {
    dataConnection: IFuncionario[]
    status: number
  }
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  'http://localhost:3000/api/routeHandler'

export async function criarFuncionario(
  nome: string,
  email: string,
  cpf: string,
  data_nascimento: Date,
  cargo: string,
  custo: number,
  tipo_custo: tipo_custo_funcionario,
  conta_bancaria: string,
  id_proprietario: number,
  id_propriedade: number
): Promise<IFuncionarioResponse | undefined> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        class: 'FuncionarioService',
        method: 'criarFuncionario',
        payload: {
          nome,
          email,
          cpf,
          data_nascimento: data_nascimento.toISOString(),
          cargo,
          custo,
          conta_bancaria,
          tipo_custo,
          id_proprietario,
          id_propriedade,
        },
      }),
    })

    const result = await response.json()
    verifyApiResponse(result)

    return result
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export async function buscarFuncionarioPorIdEProprietario(
  id: string,
  idProprietario: number
): Promise<IFuncionarioResponse | undefined> {
  try {
    const params = new URLSearchParams({
      class: 'FuncionarioService',
      method: 'buscarFuncionarioPorId',
      id,
      id_proprietario: idProprietario.toString(),
    })

    const response = await fetch(`${API_BASE_URL}?${params.toString()}`, {
      method: 'GET',
    })

    const result = await response.json()
    verifyApiResponse(result)

    return result
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export async function atualizarFuncionarioPorId(
  id: string,
  nome: string,
  email: string,
  cpf: string,
  data_nascimento: Date,
  cargo: string,
  custo: number,
  tipo_custo: tipo_custo_funcionario,
  conta_bancaria: string,
  id_proprietario: number,
  id_propriedade: number
): Promise<IFuncionarioResponse | undefined> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        class: 'FuncionarioService',
        method: 'atualizarFuncionarioPorId',
        payload: {
          id,
          nome,
          email,
          cpf,
          data_nascimento: data_nascimento.toISOString(),
          cargo,
          custo,
          tipo_custo,
          conta_bancaria,
          id_proprietario,
          id_propriedade,
        },
      }),
    })

    const result = await response.json()
    verifyApiResponse(result)

    return result
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export async function deletarFuncionarioPorId(
  id: string
): Promise<IFuncionarioResponse | undefined> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        class: 'FuncionarioService',
        method: 'deletarFuncionarioPorId',
        payload: { id },
      }),
    })

    const result = await response.json()
    verifyApiResponse(result)

    return result
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export async function buscarTodosFuncionariosDaPropriedade(
  idProprietario: number,
  idPropriedade: number
): Promise<IListaFuncionariosResponse | undefined> {
  try {
    const params = new URLSearchParams({
      class: 'FuncionarioService',
      method: 'buscarTodosFuncionariosDaPropriedade',
      id_proprietario: idProprietario.toString(),
      id_propriedade: idPropriedade.toString(),
    })

    const response = await fetch(`${API_BASE_URL}?${params.toString()}`, {
      method: 'GET',
    })

    const result = await response.json()
    verifyApiResponse(result)

    return result
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export async function buscarTodosFuncionariosDoProprietario(
  idProprietario: number
): Promise<IListaFuncionariosResponse | undefined> {
  try {
    const params = new URLSearchParams({
      class: 'FuncionarioService',
      method: 'buscarTodosFuncionariosDoProprietario',
      id_proprietario: idProprietario.toString(),
    })

    const response = await fetch(`${API_BASE_URL}?${params.toString()}`, {
      method: 'GET',
    })

    const result = await response.json()
    verifyApiResponse(result)

    return result
  } catch (error) {
    console.error(error)
    return undefined
  }
}
