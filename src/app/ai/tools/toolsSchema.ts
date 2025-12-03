import type { Tool } from 'openai/resources/responses/responses'

export const toolsSchema: Tool[] = [
  {
    type: 'function',
    name: 'listarPropriedades',
    description: 'Lista todas as propriedades cadastradas no sistema.',
    parameters: {
      type: 'object',
      properties: {},
    },
    strict: true,
  },
  {
    type: 'function',
    name: 'buscarPropriedadePorId',
    description: 'Busca uma propriedade específica pelo ID.',
    parameters: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'ID da propriedade',
        },
      },
      required: ['id'],
    },
    strict: true,
  },
  {
    type: 'function',
    name: 'criarProprietario',
    description: 'Cria um novo proprietário no sistema.',
    parameters: {
      type: 'object',
      properties: {
        nome: { type: 'string' },
        cpf: { type: 'string' },
      },
      required: ['nome', 'cpf'],
    },
    strict: true,
  },
]
