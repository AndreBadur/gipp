import { tipo_recurso } from '@/generated/prisma'
import { IAreaTarefa, IRecursoTarefa } from '../services/TarefaService'

export interface listaInsumosIdComQuantidade {
  insumo_id: number
  quantidade: number
}

export function listaDeObjetosArea(
  listaAreas: string[],
  idTarefa: number
): IAreaTarefa[] {
  const listaObjetosDeArea: IAreaTarefa[] = []
  for (const area of listaAreas) {
    const objetoArea = {
      id_area: Number(area),
      id_tarefa: idTarefa,
    }
    listaObjetosDeArea.push(objetoArea)
  }
  return listaObjetosDeArea
}

export function listaDeObjetosRecurso(
  listaMaquinarios: string[],
  listaFuncionarios: string[],
  listaInsumosComQuantidade: listaInsumosIdComQuantidade[],
  idTarefa: number
): IRecursoTarefa[] {
  const listaObjetosDeRecurso = []
  for (const maquinario of listaMaquinarios) {
    const objetoRecursoMaquinario = {
      id_recurso: Number(maquinario),
      tipo_recurso: 'maquinario' as tipo_recurso,
      status_lancamento: false,
      id_tarefa: idTarefa,
    }
    listaObjetosDeRecurso.push(objetoRecursoMaquinario)
  }
  for (const funcionario of listaFuncionarios) {
    const objetoRecursoFuncionario = {
      id_recurso: Number(funcionario),
      tipo_recurso: 'funcionario' as tipo_recurso,
      status_lancamento: false,
      id_tarefa: idTarefa,
    }
    listaObjetosDeRecurso.push(objetoRecursoFuncionario)
  }
  for (const insumo of listaInsumosComQuantidade) {
    const objetoRecursoInsumo = {
      id_recurso: Number(insumo.insumo_id),
      tipo_recurso: 'insumo' as tipo_recurso,
      status_lancamento: false,
      quantidade: insumo.quantidade,
      id_tarefa: idTarefa,
    }
    listaObjetosDeRecurso.push(objetoRecursoInsumo)
  }

  return listaObjetosDeRecurso
}
