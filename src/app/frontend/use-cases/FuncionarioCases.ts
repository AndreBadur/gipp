import { IFuncionario } from '@/app/backend/services/FuncionarioService'
import { verifyApiResponse } from '../lib/tools'

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
  conta_bancaria: string,
  cpf: string,
  pispasep: string,
  carteira_trabalho: string,
  data_nascimento: string,
  genero: 'masculino' | 'feminino',
  certidao_nascimento: Buffer,
  comprovante_residencia: Buffer,
  comprovante_escolaridade: Buffer,
  reservista: Buffer,
  id_proprietario: number
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
      method: 'buscarTodosFuncionarios',
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
  conta_bancaria: string,
  cpf: string,
  pispasep: string,
  carteira_trabalho: string,
  data_nascimento: string,
  genero: 'masculino' | 'feminino',
  certidao_nascimento: Buffer,
  comprovante_residencia: Buffer,
  comprovante_escolaridade: Buffer,
  reservista: Buffer,
  id_proprietario: number
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
