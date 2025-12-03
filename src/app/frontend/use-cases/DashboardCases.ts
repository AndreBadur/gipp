import { tipo_lancamento } from '@/generated/prisma'
import { cachedFetch } from '../lib/repoCache'
import { buscarTodosLancamentos } from './LancamentoCases'
import { buscarTodosProdutos } from './ProdutoCases'
import { buscarTodasPropriedades } from './PropriedadeCases'
import { buscarTodasTarefas, somaCustoTarefa } from './TarefaCases'

const meses = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

export async function totalLancamentosPorPropriedade(id_propriedade: number) {
  const cacheKey = `totalLancamentos:${id_propriedade}`

  return cachedFetch(cacheKey, async () => {
    const lancamentos = await buscarTodosLancamentos(id_propriedade)
    const saidas = [{ valor: 0, data: new Date() }]
    const entradas = [{ valor: 0, data: new Date() }]

    lancamentos?.data.dataConnection.map((lancamento) => {
      if (lancamento.tipo_lancamento === 'saida') {
        saidas.push({
          valor: lancamento.valor,
          data: lancamento.data_lancamento ?? new Date(),
        })
      }
      if (lancamento.tipo_lancamento === 'entrada') {
        entradas.push({
          valor: lancamento.valor,
          data: lancamento.data_lancamento ?? new Date(),
        })
      }
    })

    saidas.shift()
    entradas.shift()

    const anoAtual = new Date().getFullYear()

    const arrayDeSaidasDoAno = [{ valor: 0, data: new Date() }]
    const arrayDeEntradasDoAno = [{ valor: 0, data: new Date() }]

    saidas
      .sort((a, b) => {
        return new Date(a.data).getTime() - new Date(b.data).getTime()
      })
      .map((saida) => {
        const anoSaida = new Date(saida.data).getFullYear()
        if (anoSaida >= anoAtual - 1) {
          arrayDeSaidasDoAno.push(saida)
        }
      })

    entradas
      .sort((a, b) => {
        return new Date(a.data).getTime() - new Date(b.data).getTime()
      })
      .map((entrada) => {
        const anoEntrada = new Date(entrada.data).getFullYear()
        if (anoEntrada >= anoAtual - 1) {
          arrayDeEntradasDoAno.push(entrada)
        }
      })

    arrayDeSaidasDoAno.shift()
    arrayDeEntradasDoAno.shift()

    const retornoSaida = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    const retornoEntrada = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    arrayDeSaidasDoAno.map((saida) => {
      const saidaMes = new Date(saida.data).getMonth()
      retornoSaida[saidaMes] = +saida.valor
    })
    arrayDeEntradasDoAno.map((entrada) => {
      const entradaMes = new Date(entrada.data).getMonth()
      retornoEntrada[entradaMes] = +entrada.valor
    })

    const result = {
      meses,
      retornoEntrada,
      retornoSaida,
    }

    return result
  })
}

export async function custoDeRecursosTotais(
  id_propriedade: number,
  id_proprietario: number
) {
  const cacheKey = `custoRecursos:${id_propriedade}:${id_proprietario}`

  return cachedFetch(cacheKey, async () => {
    const tarefas = await buscarTodasTarefas(id_propriedade)
    const tarefasEntregues: {
      idTarefa: number
      dataTarefa: Date
      diasUteis: number
    }[] = []
    tarefas?.data.dataConnection.forEach((tarefa) => {
      if (tarefa.status === 'entregue' && tarefa.id) {
        tarefasEntregues.push({
          idTarefa: tarefa.id,
          dataTarefa: tarefa.data_inicio ?? new Date(),
          diasUteis: tarefa.dias_uteis ?? 0,
        })
      }
    })

    const custoTotalMaquinarios = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    const custoTotalFuncionarios = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    const custoTotalInsumos = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    await Promise.all(
      tarefasEntregues.map(async (tarefa) => {
        const fimDaTarefa = addDays(tarefa.dataTarefa, tarefa.diasUteis + 1)
        const mesDaTarefa = fimDaTarefa.getMonth()

        if (fimDaTarefa.getFullYear() >= new Date().getFullYear() - 1) {
          const custoDaTarefa = await somaCustoTarefa(
            tarefa.idTarefa.toString(),
            id_propriedade,
            id_proprietario
          )

          if (custoDaTarefa?.custoMaquinarios[0]) {
            custoTotalMaquinarios[mesDaTarefa] =
              +custoDaTarefa?.custoMaquinarios[0]
          }
          if (custoDaTarefa?.custoFuncionarios[0]) {
            custoTotalFuncionarios[mesDaTarefa] =
              +custoDaTarefa.custoFuncionarios[0]
          }
          if (custoDaTarefa?.custoInsumos[0]) {
            custoTotalInsumos[mesDaTarefa] = +custoDaTarefa.custoInsumos[0]
          }
        }
      })
    )

    const result = {
      meses,
      custoTotalMaquinarios,
      custoTotalFuncionarios,
      custoTotalInsumos,
    }

    return result
  })
}

export async function valoresTotaisDosProdutosDisponiveis(
  id_propriedade: number
) {
  const produtos = await buscarTodosProdutos(id_propriedade)
  let custoTotalDeProdutos = 0
  let receitaTotalDeProdutos = 0

  produtos?.data.dataConnection.map((produto) => {
    if (produto.quantidade && produto.quantidade > 0) {
      if (produto.custo) {
        custoTotalDeProdutos = +produto.custo
      }
      if (produto.preco_venda) {
        receitaTotalDeProdutos = +produto.preco_venda
      }
    }
  })

  return {
    custoTotalDeProdutos,
    receitaTotalDeProdutos,
  }
}
export async function valoresTotaisDeLancamentosEmTodasPropriedades(
  id_proprietario: number
) {
  const propriedades = await buscarTodasPropriedades(id_proprietario)
  const listaPropriedades: number[] = []
  propriedades?.data.dataConnection.map((propriedade) => {
    if (propriedade.id) {
      listaPropriedades.push(propriedade.id)
    }
  })

  const listaLancamentosDoMes: { tipo: tipo_lancamento; valor: number }[] = [
    { tipo: 'entrada', valor: 0 },
  ]
  listaPropriedades.map(async (idPropriedade) => {
    const lancamentos = await buscarTodosLancamentos(idPropriedade)
    lancamentos?.data.dataConnection.map((lancamento) => {
      const atual = isFromLastMonth(lancamento.data_lancamento ?? new Date())
      if (atual) {
        const lancamentoDoMes = {
          tipo: tipo_lancamento[lancamento.tipo_lancamento],
          valor: lancamento.valor,
        }
        listaLancamentosDoMes.push(lancamentoDoMes)
      }
    })
  })
  listaLancamentosDoMes.shift()
  console.log('listaLancamentosDoMes')
  console.log(listaLancamentosDoMes)

  console.log('listaLancamentosDoMes[1]')
  console.log(listaLancamentosDoMes[1])

  const totalEntradaDoMes = 0
  const totalSaidaDoMes = 0
  const saldo = totalEntradaDoMes - totalSaidaDoMes
  return {
    totalEntradaDoMes,
    totalSaidaDoMes,
    saldo,
  }
}

function addDays(dateInput: Date, days: number): Date {
  const date = new Date(dateInput)

  if (isNaN(date.getTime())) {
    throw new Error('Valor recebido não é uma data válida: ' + dateInput)
  }

  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000)
}

function isFromLastMonth(dateInput: Date): boolean {
  const date = new Date(dateInput) // converte string/timestamp se necessário

  if (isNaN(date.getTime())) return false

  const now = new Date()

  // Mês anterior (tratando virada de ano automaticamente)
  const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0) // dia 0 do mês atual = último do anterior

  // Normalizar horários
  firstDayLastMonth.setHours(0, 0, 0, 0)
  lastDayLastMonth.setHours(23, 59, 59, 999)

  return date >= firstDayLastMonth && date <= lastDayLastMonth
}
// if (lancamento.tipo === 'entrada') {
//   console.log('estou no tipo entrada')
//   totalEntradaDoMes = +lancamento.valor
//   console.log(totalEntradaDoMes)
// }
// if (lancamento.tipo === 'saida') {
//   console.log('estou no tipo saida')
//   totalSaidaDoMes = +lancamento.valor
//   console.log(totalSaidaDoMes)
// }
