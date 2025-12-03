import { buscarTodasPropriedades } from '@/app/frontend/use-cases/PropriedadeCases'
import prisma from '@/lib/prisma'
/* eslint-disable @typescript-eslint/no-explicit-any */
export async function executeTool(name: string, args: any) {
  switch (name) {
    case 'listarPropriedades':
      return buscarTodasPropriedades(Number(args))

    case 'buscarPropriedadePorId':
      return await prisma.propriedade.findUnique({
        where: { id: args.id },
      })

    case 'criarProprietario':
      return await prisma.proprietario.create({
        data: {
          registro: args.registro,
          cep: args.cep,
          email: args.email,
          endereco: args.endereco,
          numero: args.numero,
        },
      })

    default:
      throw new Error(`Função desconhecida: ${name}`)
  }
}
