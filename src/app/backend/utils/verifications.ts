import { NextRequest } from 'next/server'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isDataNullOrUndefined(data: any) {
  console.log('log in DataNull: ', data)
  if (data !== null && data !== undefined) {
    return false
  }
  if (data == null || data == undefined) {
    throw new Error('Retorno vazio', { cause: 'void' })
  }
  throw new Error('Erro inesperado', { cause: 'unexpected' })
}

export async function fromRequestToGenericType<T>(request: NextRequest) {
  const data: T = await request.json()
  return data
}

export function mapErrorToResponse(error: Error) {
  console.error(error)
  if (error.cause === 'void') {
    return Response.json(
      { success: false, statusText: 'Não contém dados' },
      { status: 404 }
    )
  }

  return Response.json(
    { success: false, statusText: 'Erro interno inesperado.' },
    { status: 500 }
  )
}
