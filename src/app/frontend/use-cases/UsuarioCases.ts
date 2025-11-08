'use server'

import { IUsuario } from '@/app/backend/services/UsuarioService'
import { verifyApiResponse } from '../lib/tools'

interface IUserResponse {
  success: boolean
  data: {
    dataConnection: IUsuario
    status: number
  }
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  'http://localhost:3000/api/routeHandler'

export async function autenticarUsuario(
  email: string,
  senha: string
): Promise<IUserResponse | undefined> {
  try {
    const params = new URLSearchParams({
      class: 'UsuarioService',
      method: 'buscarUsuarioPorEmail',
      email,
      senha,
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

export async function criarUsuario(
  email: string,
  telefone: string,
  senha: string
) {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        class: 'UsuarioService',
        method: 'criarUsuario',
        payload: { email, telefone, senha },
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

export async function deletarUsuario(email: string) {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        class: 'UsuarioService',
        method: 'deletarUsuario',
        payload: { email },
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
