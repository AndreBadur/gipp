'use server'

import { autenticarUsuario } from '../frontend/use-cases/UsuarioCases'

export default async function Page() {
  const response = await autenticarUsuario('email@senha.com', 'senha@1234')

  console.log(JSON.stringify(response, null, 2))
  return <div>Olá Mundo!!!</div>
}
