'use server'

import { verifyApiResponse } from '../lib/tools'

export async function autenticarUsuario(email: string, senha: string) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/routeHandler?class=UsuarioService&method=buscarUsuarioPorEmail&email=${email}&senha=${senha}`,
      {
        method: 'GET',
      }
    )

    verifyApiResponse(response)
    return response.json()
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
    const response = await fetch('http://localhost:3000/api/routeHandler', {
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

    verifyApiResponse(response)
    return response.json()
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export async function deletarUsuario(email: string) {
  try {
    const response = await fetch('http://localhost:3000/api/routeHandler', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        class: 'UsuarioService',
        method: 'deletarUsuario',
        payload: { email },
      }),
    })

    verifyApiResponse(response)
    return response.json()
  } catch (error) {
    console.error(error)
    return undefined
  }
}
