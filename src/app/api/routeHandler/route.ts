import { MaquinarioService } from '@/app/backend/services/MaquinarioService'
import { ProprietarioService } from '@/app/backend/services/ProprietarioService'
import { UsuarioService } from '@/app/backend/services/UsuarioService'
import { mapErrorToResponse } from '@/app/backend/utils/verifications'
import { NextResponse } from 'next/server'

/* eslint-disable @typescript-eslint/no-explicit-any */
type AnyClass<T = any> = new (...args: any[]) => T
const classes: Record<string, AnyClass> = {
  UsuarioService,
  ProprietarioService,
  MaquinarioService,
}

export async function POST(req: Request) {
  const { class: className, method, payload } = await req.json()

  try {
    const ServiceClass = classes[className]
    if (!ServiceClass) {
      return NextResponse.json(
        { success: false, message: `Classe '${className}' não encontrada.` },
        { status: 400 }
      )
    }

    const instance = new ServiceClass()

    if (typeof instance[method] !== 'function') {
      return NextResponse.json(
        {
          success: false,
          message: `Método '${method}' não existe em '${className}'.`,
        },
        { status: 400 }
      )
    }

    const result = await instance[method](
      ...(Array.isArray(payload) ? payload : [payload])
    )

    return NextResponse.json({ success: true, data: result, status: 202 })
  } catch (error: any) {
    return mapErrorToResponse(error)
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)

    const className = searchParams.get('class')
    const method = searchParams.get('method')

    if (!className || !method) {
      return NextResponse.json(
        {
          success: false,
          message: "Parâmetros 'class' e 'method' são obrigatórios.",
        },
        { status: 400 }
      )
    }

    const payload: Record<string, any> = {}
    searchParams.forEach((value, key) => {
      if (key !== 'class' && key !== 'method') {
        payload[key] = value
      }
    })

    const ServiceClass = classes[className]
    if (!ServiceClass) {
      return NextResponse.json(
        { success: false, message: `Classe '${className}' não encontrada.` },
        { status: 400 }
      )
    }

    const instance = new ServiceClass()

    if (typeof instance[method] !== 'function') {
      return NextResponse.json(
        {
          success: false,
          message: `Método '${method}' não existe em '${className}'.`,
        },
        { status: 400 }
      )
    }

    const result = await instance[method](payload)
    // console.log(`ROUTE HANDLER RESULT: ${JSON.stringify(result)}`)

    return NextResponse.json({ success: true, data: result })
  } catch (error: any) {
    return mapErrorToResponse(error)
  }
}

export async function PATCH(req: Request) {
  const { class: className, method, payload } = await req.json()

  console.log('CHEGUEI NA ROTA DE PATCH')

  try {
    const ServiceClass = classes[className]
    if (!ServiceClass) {
      return NextResponse.json(
        { success: false, message: `Classe '${className}' não encontrada.` },
        { status: 400 }
      )
    }

    const instance = new ServiceClass()

    if (typeof instance[method] !== 'function') {
      return NextResponse.json(
        {
          success: false,
          message: `Método '${method}' não existe em '${className}'.`,
        },
        { status: 400 }
      )
    }

    const result = await instance[method](
      ...(Array.isArray(payload) ? payload : [payload])
    )

    return NextResponse.json({ success: true, data: result, status: 202 })
  } catch (error: any) {
    return mapErrorToResponse(error)
  }
}

export async function DELETE(req: Request) {
  const { class: className, method, payload } = await req.json()

  try {
    const ServiceClass = classes[className]
    if (!ServiceClass) {
      return NextResponse.json(
        { success: false, message: `Classe '${className}' não encontrada.` },
        { status: 400 }
      )
    }

    const instance = new ServiceClass()

    if (typeof instance[method] !== 'function') {
      return NextResponse.json(
        {
          success: false,
          message: `Método '${method}' não existe em '${className}'.`,
        },
        { status: 400 }
      )
    }

    const result = await instance[method](
      ...(Array.isArray(payload) ? payload : [payload])
    )

    return NextResponse.json({ success: true, data: result, status: 200 })
  } catch (error: any) {
    return mapErrorToResponse(error)
  }
}
