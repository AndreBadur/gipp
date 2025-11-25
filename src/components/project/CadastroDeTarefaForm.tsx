'use client'

import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import {
  Dispatch,
  FormEvent,
  Fragment,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Checkbox } from '../ui/checkbox'
import { SessionContext } from '@/app/proprietario/SessionProvider'
import { Toast } from '../ui/toast'
import DialogConfirmaDelecao from './DialogConfirmaDelecao'
import { prioridade_tarefa, status_tarefa } from '@/generated/prisma'
import {
  adicionarAreaTarefa,
  adicionarRecursoTarefa,
  atualizarTarefaPorId,
  buscarTarefaPorIdEPropriedade,
  buscarTodosRecursos,
  criarTarefa,
  removerRecursoDaTarefa,
  deletarTarefa,
  IAreaTarefaResponse,
  IListaDeRecursosResponse,
  IRecursoTarefaResponse,
  listarAreasDaTarefa,
  listarRecursosDaTarefa,
  removerAreaTarefaPorId,
  somaCustoTarefa,
  lancamentoDaTarefa,
} from '@/app/frontend/use-cases/TarefaCases'
import {
  buscarTodasAreas,
  IListaAreasResponse,
} from '@/app/frontend/use-cases/AreaCases'

import {
  listaDeObjetosArea,
  listaDeObjetosRecurso,
  listaInsumosIdComQuantidade,
} from '@/app/backend/utils/listaDeObjetos'
import {
  buscarTodosCentrosDeCusto,
  IListaCentroCustosResponse,
} from '@/app/frontend/use-cases/CentroCustoCases'

export default function CadastroDeTarefaForm({
  idTarefa,
}: {
  idTarefa?: string
}) {
  const [titulo, setTitulo] = useState<string>('')
  const [descricao, setDescricao] = useState<string>('')
  const [dataInicio, setDataInicio] = useState<Date>(new Date())
  const [diasUteis, setDiasUteis] = useState<number>()
  const [horasTrabalho, setHorasTrabalho] = useState<number>()
  const [status, setStatus] = useState<
    'a_fazer' | 'fazendo' | 'validando' | 'entregue'
  >()
  const [prioridade, setPrioridade] = useState<
    'baixa' | 'media' | 'alta' | 'urgente'
  >()
  const dataInicioFormatada = new Date(dataInicio).toISOString().split('T')[0]
  const [areas, setAreas] = useState<IListaAreasResponse | undefined>(undefined)
  const listaAreas = areas?.data.dataConnection
  const [areasDaTarefa, setAreasDaTarefa] = useState<number[]>([])
  const [areasDropdownAberto, setAreasDropdownAberto] = useState(false)
  const [recursos, setRecursos] = useState<
    IListaDeRecursosResponse | undefined
  >(undefined)
  const maquinarios = recursos?.maquinarios
  const funcionarios = recursos?.funcionarios
  const insumos = recursos?.insumos
  const [maquinariosSelecionados, setMaquinariosSelecionados] = useState<
    number[]
  >([])
  const [funcionariosSelecionados, setFuncionariosSelecionados] = useState<
    number[]
  >([])
  const [insumosSelecionados, setInsumosSelecionados] = useState<number[]>([])
  const [maquinariosDropdownAberto, setMaquinariosDropdownAberto] =
    useState(false)
  const [funcionariosDropdownAberto, setFuncionariosDropdownAberto] =
    useState(false)
  const [insumosDropdownAberto, setInsumosDropdownAberto] = useState(false)
  const [quantidadesInsumos, setQuantidadesInsumos] = useState<
    Record<number, number>
  >({})
  const [listaAreasDaTarefaResponse, setListaAreasDaTarefaResponse] = useState<
    IAreaTarefaResponse | undefined
  >()
  const [listaRecursosDaTarefa, setListaRecursosDaTarefa] = useState<
    IRecursoTarefaResponse | undefined
  >()
  const [listaCentrosDeCusto, setListaCentrosDeCusto] = useState<
    IListaCentroCustosResponse | undefined
  >()
  const [centroCustoSelecionado, setCentroCustoSelecionado] = useState<
    number | ''
  >('')
  const [custoTotal, setCustoTotal] = useState<number>()
  const [statusEntregueDoBD, setStatusEntregueDoBD] = useState<boolean>(false)

  const [toast, setToast] = useState<{
    title: string
    description?: string
    variant: 'default' | 'success' | 'error'
  } | null>(null)
  const deleteDialogRef = useRef<HTMLDialogElement>(null)
  const centroCustoDialogRef = useRef<HTMLDialogElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [statusInicial, setStatusInicial] = useState<status_tarefa | undefined>(
    undefined
  )
  const [statusAnterior, setStatusAnterior] = useState<
    status_tarefa | undefined
  >(undefined)

  const session = useContext(SessionContext)
  const idPropriedade = session.propriedadeSelecionadaId
  const idProprietario = session.idProprietario

  const listaAreasRandomizada = useMemo(
    () => randomizarLista(listaAreas),
    [listaAreas]
  )

  const recursosDaTarefa = useMemo(() => {
    const dataConnection = listaRecursosDaTarefa?.data.dataConnection
    if (!dataConnection) return []
    return Array.isArray(dataConnection) ? dataConnection : [dataConnection]
  }, [listaRecursosDaTarefa])
  const listaMaquinariosRandomizada = useMemo(
    () => randomizarLista(maquinarios),
    [maquinarios]
  )
  const listaFuncionariosRandomizada = useMemo(
    () => randomizarLista(funcionarios),
    [funcionarios]
  )
  const listaInsumosRandomizada = useMemo(
    () => randomizarLista(insumos),
    [insumos]
  )
  const areasDaTarefaResponseNormalizadas = useMemo(() => {
    const dataConnection = listaAreasDaTarefaResponse?.data.dataConnection
    if (!dataConnection) return []
    return Array.isArray(dataConnection) ? dataConnection : [dataConnection]
  }, [listaAreasDaTarefaResponse])
  const centrosDeCusto = listaCentrosDeCusto?.data.dataConnection

  const descricaoAreasSelecionadas = useMemo(() => {
    if (!listaAreas || areasDaTarefa.length === 0) return ''
    return listaAreas
      .filter((area) => area.id && areasDaTarefa.includes(area.id))
      .map((area) => area.nome)
      .join(', ')
  }, [listaAreas, areasDaTarefa])

  const descricaoMaquinariosSelecionados = useMemo(() => {
    if (!maquinarios || maquinariosSelecionados.length === 0) return ''
    return maquinarios
      .filter(
        (maquinario) =>
          maquinario.id && maquinariosSelecionados.includes(maquinario.id)
      )
      .map((maquinario) => maquinario.modelo)
      .join(', ')
  }, [maquinarios, maquinariosSelecionados])

  const descricaoFuncionariosSelecionados = useMemo(() => {
    if (!funcionarios || funcionariosSelecionados.length === 0) return ''
    return funcionarios
      .filter(
        (funcionario) =>
          funcionario.id && funcionariosSelecionados.includes(funcionario.id)
      )
      .map((funcionario) => funcionario.nome)
      .join(', ')
  }, [funcionarios, funcionariosSelecionados])

  const descricaoInsumosSelecionados = useMemo(() => {
    if (!insumos || insumosSelecionados.length === 0) return ''
    return insumos
      .filter((insumo) => insumo.id && insumosSelecionados.includes(insumo.id))
      .map((insumo) => insumo.nome)
      .join(', ')
  }, [insumos, insumosSelecionados])

  function alternarSelecao(
    itemId: number | undefined,
    setState: Dispatch<SetStateAction<number[]>>
  ) {
    if (typeof itemId !== 'number') return
    setState((prevState) =>
      prevState.includes(itemId)
        ? prevState.filter((id) => id !== itemId)
        : [...prevState, itemId]
    )
  }

  function atualizarQuantidadeInsumo(insumoId: number, quantidade: number) {
    if (Number.isNaN(quantidade) || quantidade < 1) return
    setQuantidadesInsumos((prevState) => ({
      ...prevState,
      [insumoId]: quantidade,
    }))
  }

  useEffect(() => {
    if (idTarefa) {
      buscarTarefaPorIdEPropriedade(idTarefa, idPropriedade ?? 0).then(
        (data) => {
          setTitulo(data?.data?.dataConnection?.titulo ?? '')
          setDescricao(data?.data?.dataConnection?.descricao ?? '')
          setDataInicio(data?.data?.dataConnection.data_inicio ?? new Date())
          setDiasUteis(data?.data?.dataConnection.dias_uteis ?? 1)
          setHorasTrabalho(data?.data?.dataConnection?.horas_trabalho ?? 1)
          setStatus(data?.data?.dataConnection?.status)
          setPrioridade(data?.data?.dataConnection?.prioridade)
          setStatusInicial(data?.data?.dataConnection?.status)
          if (data?.data?.dataConnection?.status === 'entregue') {
            setStatusEntregueDoBD(true)
          }
        }
      )
      listarRecursosDaTarefa(Number(idTarefa)).then((data) => {
        setListaRecursosDaTarefa(data)
      })
      listarAreasDaTarefa(Number(idTarefa)).then((data) => {
        setListaAreasDaTarefaResponse(data)
      })
      somaCustoTarefa(idTarefa, idPropriedade ?? 0, idProprietario ?? 0).then(
        (data) => {
          setCustoTotal(data?.custoTotal)
        }
      )
    }
    buscarTodasAreas(idPropriedade ?? 0).then((data) => {
      setAreas(data)
    })
    buscarTodosRecursos(idPropriedade ?? 0, idProprietario ?? 0).then(
      (data) => {
        setRecursos(data)
      }
    )
    buscarTodosCentrosDeCusto(idPropriedade ?? 0).then((data) => {
      setListaCentrosDeCusto(data)
    })
  }, [session, idTarefa, idPropriedade, idProprietario])

  useEffect(() => {
    if (!idTarefa) {
      setAreasDaTarefa([])
      return
    }
    if (!listaAreasDaTarefaResponse) return

    const novasAreas = areasDaTarefaResponseNormalizadas.map(
      (area) => area.id_area
    )
    setAreasDaTarefa(novasAreas)
  }, [idTarefa, listaAreasDaTarefaResponse, areasDaTarefaResponseNormalizadas])

  useEffect(() => {
    if (!idTarefa) return
    if (!listaRecursosDaTarefa) {
      setMaquinariosSelecionados([])
      setFuncionariosSelecionados([])
      setInsumosSelecionados([])
      setQuantidadesInsumos({})
      return
    }

    const novosMaquinarios: number[] = []
    const novosFuncionarios: number[] = []
    const novosInsumos: number[] = []
    const novasQuantidades: Record<number, number> = {}

    recursosDaTarefa.forEach((recurso) => {
      const idRecurso = recurso.id_recurso
      if (!idRecurso) return

      if (recurso.tipo_recurso === 'maquinario') {
        novosMaquinarios.push(idRecurso)
        return
      }

      if (recurso.tipo_recurso === 'funcionario') {
        novosFuncionarios.push(idRecurso)
        return
      }

      if (recurso.tipo_recurso === 'insumo') {
        novosInsumos.push(idRecurso)
        novasQuantidades[idRecurso] = recurso.quantidade ?? 1
      }
    })

    setMaquinariosSelecionados(novosMaquinarios)
    setFuncionariosSelecionados(novosFuncionarios)
    setInsumosSelecionados(novosInsumos)
    setQuantidadesInsumos(novasQuantidades)
  }, [idTarefa, listaRecursosDaTarefa, recursosDaTarefa])

  async function salvar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const titulo = formData.get('titulo') as string
    const descricao = formData.get('descricao') as string
    const dataInicio = formData.get('dataInicio') as string
    const diasUteis = formData.get('diasUteis') as string
    const horasTrabalho = formData.get('horasTrabalho') as string
    const diasUteisNumero = Math.max(1, Number(diasUteis) || 0)
    const horasTrabalhoNumero = Math.max(1, Number(horasTrabalho) || 0)
    const statusForm = formData.get('status') as status_tarefa
    const prioridade = formData.get('prioridade') as prioridade_tarefa
    const centroCustoFormValue = formData.get('centroCusto')
    const centroCusto = centroCustoFormValue
      ? Number(centroCustoFormValue)
      : undefined
    if (centroCustoFormValue && Number.isNaN(centroCusto)) {
      setToast({
        title: 'Dados inválidos',
        description: 'Selecione um centro de custo válido.',
        variant: 'error',
      })
      return
    }
    const listaAreas = formData.getAll('areasDaTarefa') as string[]
    const listaMaquinarios = formData.getAll('maquinariosDaTarefa') as string[]
    const listaFuncionarios = formData.getAll(
      'funcionariosDaTarefa'
    ) as string[]
    const listaInsumosId = formData.getAll('insumosDaTarefa') as string[]
    const listaInsumosIdComQuantidade = listaInsumosId.map((insumo) => {
      const quantidade = formData.get(`quantidadeInsumo:${insumo}`) as string
      return {
        insumo_id: Number(insumo),
        quantidade: Number(quantidade),
      }
    })

    const listaAreasDaTarefaBD =
      listaAreasDaTarefaResponse?.data.dataConnection ?? []
    const listaRecursosDaTarefaBD =
      listaRecursosDaTarefa?.data.dataConnection ?? []
    let existe = false

    const arrayDeNovasAreas: string[] = []
    listaAreas.map((idArea) => {
      existe = listaAreasDaTarefaBD.some(
        (areaObj) => areaObj.id_area === Number(idArea)
      )
      if (!existe) {
        arrayDeNovasAreas.push(idArea)
      }
    })

    const arrayDeAreasExcluidas: string[] = []
    listaAreasDaTarefaBD.map((objArea) => {
      existe = listaAreas.some((id) => Number(id) === objArea.id_area)
      if (!existe) {
        arrayDeAreasExcluidas.push(objArea.id_area.toString())
      }
    })

    const arrayDeNovosMaquinarios: string[] = []
    listaMaquinarios.map((idMaquinario) => {
      existe = listaRecursosDaTarefaBD.some(
        (objRecurso) =>
          objRecurso.id_recurso === Number(idMaquinario) &&
          objRecurso.tipo_recurso === 'maquinario'
      )
      if (!existe) {
        arrayDeNovosMaquinarios.push(idMaquinario)
      }
    })

    const arrayDeNovosFuncionarios: string[] = []
    listaFuncionarios.map((idFuncionario) => {
      existe = listaRecursosDaTarefaBD.some(
        (objRecurso) =>
          objRecurso.id_recurso === Number(idFuncionario) &&
          objRecurso.tipo_recurso === 'funcionario'
      )
      if (!existe) {
        arrayDeNovosFuncionarios.push(idFuncionario)
      }
    })

    const arrayDeNovosInsumos: listaInsumosIdComQuantidade[] = []
    listaInsumosIdComQuantidade.map((objInsumoQuantidade) => {
      existe = listaRecursosDaTarefaBD.some(
        (objRecurso) =>
          objRecurso.id_recurso === Number(objInsumoQuantidade.insumo_id) &&
          objRecurso.tipo_recurso === 'insumo'
      )
      if (!existe) {
        arrayDeNovosInsumos.push({
          insumo_id: objInsumoQuantidade.insumo_id,
          quantidade: objInsumoQuantidade.quantidade,
        })
      }
    })

    const arrayDeMaquinariosExcluidos: string[] = []
    listaRecursosDaTarefaBD.map((objRecurso) => {
      if (objRecurso.tipo_recurso === 'maquinario') {
        existe = listaMaquinarios.some(
          (id) => Number(id) === objRecurso.id_recurso
        )
        if (!existe) {
          arrayDeMaquinariosExcluidos.push(objRecurso.id_recurso.toString())
        }
      }
    })

    const arrayDeFuncionariosExcluidos: string[] = []
    listaRecursosDaTarefaBD.map((objRecurso) => {
      if (objRecurso.tipo_recurso === 'funcionario') {
        existe = listaFuncionarios.some(
          (id) => Number(id) === objRecurso.id_recurso
        )
        if (!existe) {
          arrayDeFuncionariosExcluidos.push(objRecurso.id_recurso.toString())
        }
      }
    })

    const arrayDeInsumosExcluidos: listaInsumosIdComQuantidade[] = []
    listaRecursosDaTarefaBD.map((objRecurso) => {
      if (objRecurso.tipo_recurso === 'insumo') {
        existe = listaInsumosId.some(
          (id) => Number(id) === objRecurso.id_recurso
        )
        if (!existe) {
          arrayDeInsumosExcluidos.push({
            insumo_id: objRecurso.id_recurso,
            quantidade: 0,
          })
        }
      }
    })
    if (
      statusForm === 'entregue' &&
      statusInicial !== statusForm &&
      (centroCustoSelecionado === '' || centroCustoSelecionado === undefined)
    ) {
      centroCustoDialogRef.current?.showModal()
      return
    }

    try {
      let resultado
      if (idTarefa) {
        resultado = await atualizarTarefaPorId(
          idTarefa,
          titulo,
          descricao,
          new Date(dataInicio),
          diasUteisNumero,
          horasTrabalhoNumero,
          statusForm,
          prioridade,
          0,
          idPropriedade ?? 0
        )
        const resultadoTarefa = resultado?.data.dataConnection.id ?? 0
        if (arrayDeNovasAreas.length > 0) {
          const listaObjetosDeArea = listaDeObjetosArea(
            arrayDeNovasAreas,
            resultadoTarefa
          )
          resultado = await adicionarAreaTarefa(listaObjetosDeArea)
        }
        if (arrayDeAreasExcluidas.length > 0) {
          const listaObjetosDeArea = listaDeObjetosArea(
            arrayDeAreasExcluidas,
            resultadoTarefa
          )
          resultado = await removerAreaTarefaPorId(listaObjetosDeArea)
        }
        if (
          arrayDeNovosMaquinarios.length > 0 ||
          arrayDeNovosFuncionarios.length > 0 ||
          arrayDeNovosInsumos.length > 0
        ) {
          const listaObjetosDeRecurso = listaDeObjetosRecurso(
            arrayDeNovosMaquinarios,
            arrayDeNovosFuncionarios,
            arrayDeNovosInsumos,
            resultadoTarefa
          )
          resultado = await adicionarRecursoTarefa(listaObjetosDeRecurso)
        }
        if (
          arrayDeMaquinariosExcluidos.length > 0 ||
          arrayDeFuncionariosExcluidos.length > 0 ||
          arrayDeInsumosExcluidos.length > 0
        ) {
          const listaObjetosDeRecurso = listaDeObjetosRecurso(
            arrayDeMaquinariosExcluidos,
            arrayDeFuncionariosExcluidos,
            arrayDeInsumosExcluidos,
            resultadoTarefa
          )

          resultado = await removerRecursoDaTarefa(listaObjetosDeRecurso)
        }

        if (
          statusForm === 'entregue' &&
          centroCusto !== undefined &&
          centroCusto > 0
        ) {
          resultado = await lancamentoDaTarefa(
            idTarefa,
            idPropriedade ?? 0,
            idProprietario ?? 0,
            centroCusto
          )
        }
      } else {
        resultado = await criarTarefa(
          titulo,
          descricao,
          new Date(dataInicio),
          diasUteisNumero,
          horasTrabalhoNumero,
          statusForm,
          prioridade,
          0,
          idPropriedade ?? 0
        )
        const resultadoTarefa = resultado?.data.dataConnection.id ?? 0
        const listaObjetosDeArea = listaDeObjetosArea(
          listaAreas,
          resultadoTarefa
        )
        if (listaObjetosDeArea.length > 0)
          await adicionarAreaTarefa(listaObjetosDeArea)

        const listaObjetosDeRecurso = listaDeObjetosRecurso(
          listaMaquinarios,
          listaFuncionarios,
          listaInsumosIdComQuantidade,
          resultadoTarefa
        )
        if (listaObjetosDeRecurso.length > 0)
          await adicionarRecursoTarefa(listaObjetosDeRecurso)
      }

      if (resultado && resultado.success) {
        setToast({
          title: idTarefa ? 'Tarefa atualizada!' : 'Tarefa criada!',
          description: `${titulo} foi ${
            idTarefa ? 'atualizada' : 'cadastrada'
          } com sucesso.`,
          variant: 'success',
        })
        window.location.reload()
      } else {
        setToast({
          title: 'Erro ao salvar',
          description: 'Não foi possível salvar os dados. Tente novamente.',
          variant: 'error',
        })
      }
    } catch (error) {
      console.error(error)
      setToast({
        title: 'Erro inesperado',
        description: 'Ocorreu um erro ao processar sua solicitação.',
        variant: 'error',
      })
    }
  }

  async function resultadoDeleçao() {
    if (idTarefa) {
      try {
        const resultado = await deletarTarefa(idTarefa)

        if (resultado && resultado.success) {
          setToast({
            title: 'Tarefa excluida!',
            description: `${titulo} foi excluído com sucesso.`,
            variant: 'success',
          })
          window.location.reload()
        } else {
          setToast({
            title: 'Erro ao salvar',
            description: 'Não foi possível salvar os dados. Tente novamente.',
            variant: 'error',
          })
        }
      } catch (error) {
        console.error(error)
        setToast({
          title: 'Erro inesperado',
          description: 'Ocorreu um erro ao processar sua solicitação.',
          variant: 'error',
        })
      }
    } else {
      setToast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar os dados. Tente novamente.',
        variant: 'error',
      })
    }
  }

  return (
    <>
      {toast && (
        <Toast
          title={toast.title}
          description={toast.description}
          variant={toast.variant}
          onClose={() => setToast(null)}
        />
      )}

      <form
        ref={formRef}
        className={`bg-secondary-background h-auto w-full p-1 rounded-lg`}
        onSubmit={salvar}
      >
        <div className={`w-full h-auto`}>
          <div className="grid h-full gap-1 px-3.5 pb-2">
            <div>
              <Label htmlFor="titulo">Titulo *</Label>
              <Input
                type="text"
                id="titulo"
                name="titulo"
                defaultValue={titulo}
                required
              />
            </div>
            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Input
                type="text"
                id="descricao"
                name="descricao"
                defaultValue={descricao}
              />
            </div>
            <div>
              <Label htmlFor="dataInicio">Data de Início *</Label>
              <Input
                type="date"
                id="dataInicio"
                name="dataInicio"
                value={dataInicioFormatada}
                required
              />
            </div>
            <div>
              <Label htmlFor="diasUteis">Dias Úteis</Label>
              <Input
                type="number"
                id="diasUteis"
                name="diasUteis"
                defaultValue={diasUteis}
                required
                min={1}
              />
            </div>
            <div>
              <Label htmlFor="horasTrabalho">Horas Trabalhadas</Label>
              <Input
                type="number"
                id="horasTrabalho"
                name="horasTrabalho"
                defaultValue={horasTrabalho}
                required
                min={1}
              />
            </div>
            <div>
              <Label htmlFor="status">Definir status *</Label>
              <select
                id="status"
                name="status"
                className="flex h-10 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base text-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                value={status ?? ''}
                required
                onChange={(event) => {
                  const novoStatus = event.target.value as status_tarefa
                  setStatusAnterior(status ?? statusInicial)
                  setStatus(novoStatus)
                }}
              >
                <option value="" disabled hidden>
                  Selecione uma opção
                </option>
                <option value="a_fazer">A Fazer</option>
                <option value="fazendo">Fazendo</option>
                <option value="validando">Validando</option>
                <option value="entregue">Entregue</option>
              </select>
            </div>
            <div>
              <Label htmlFor="prioridade">Definir prioridade *</Label>
              <select
                id="prioridade"
                name="prioridade"
                className="flex h-10 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base text-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                value={prioridade ?? ''}
                required
                onChange={(event) =>
                  setPrioridade(event.target.value as prioridade_tarefa)
                }
              >
                <option value="" disabled hidden>
                  Selecione uma opção
                </option>
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>
            <input
              type="hidden"
              name="centroCusto"
              value={
                centroCustoSelecionado === '' ? '' : centroCustoSelecionado
              }
            />
            <div className="relative">
              <Label htmlFor="areasDaTarefa">
                Selecione as Áreas da Tarefa *
              </Label>
              <button
                type="button"
                id="areasDaTarefa"
                className="flex h-10 w-full items-center justify-between rounded-base border-2 border-border bg-[#090e1d] px-3 py-2 text-sm font-base text-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                onClick={() =>
                  setAreasDropdownAberto((previousValue) => !previousValue)
                }
                aria-expanded={areasDropdownAberto}
              >
                <span className="truncate text-left">
                  {descricaoAreasSelecionadas || 'Selecione uma ou mais áreas'}
                </span>
                <svg
                  className={`h-4 w-4 transition-transform ${
                    areasDropdownAberto ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {areasDaTarefa.map((areaId) => (
                <input
                  key={`area-hidden-${areaId}`}
                  type="hidden"
                  name="areasDaTarefa"
                  value={areaId}
                />
              ))}
              {areasDropdownAberto && (
                <div className="absolute left-0 right-0 z-20 mt-1 max-h-60 overflow-y-auto rounded-base border-2 border-border bg-[#090e1d] shadow-lg">
                  {listaAreasRandomizada.length === 0 ? (
                    <p className="px-3 py-2 text-sm text-muted-foreground">
                      Nenhuma área disponível no momento.
                    </p>
                  ) : (
                    listaAreasRandomizada.map((area) => {
                      if (!area.id) return null
                      const checkboxId = `area-option-${area.id}`
                      return (
                        <div
                          key={area.id}
                          className="px-3 py-2 hover:bg-black/5"
                        >
                          <label
                            htmlFor={checkboxId}
                            className="flex cursor-pointer items-center gap-2 text-sm text-foreground"
                          >
                            <Checkbox
                              id={checkboxId}
                              checked={areasDaTarefa.includes(area.id)}
                              onCheckedChange={() =>
                                alternarSelecao(area.id, setAreasDaTarefa)
                              }
                            />
                            <span>{area.nome}</span>
                          </label>
                        </div>
                      )
                    })
                  )}
                </div>
              )}
            </div>
            <div className="relative">
              <Label htmlFor="maquinariosDaTarefa">
                Selecione os Maquinários da Tarefa
              </Label>
              <button
                type="button"
                id="maquinariosDaTarefa"
                className="flex h-10 w-full items-center justify-between rounded-base border-2 border-border bg-[#090e1d] px-3 py-2 text-sm font-base text-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                onClick={() =>
                  setMaquinariosDropdownAberto(
                    (previousValue) => !previousValue
                  )
                }
                aria-expanded={maquinariosDropdownAberto}
              >
                <span className="truncate text-left">
                  {descricaoMaquinariosSelecionados ||
                    'Selecione um ou mais maquinários'}
                </span>
                <svg
                  className={`h-4 w-4 transition-transform ${
                    maquinariosDropdownAberto ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {maquinariosSelecionados.map((maquinarioId) => (
                <input
                  key={`maquinario-hidden-${maquinarioId}`}
                  type="hidden"
                  name="maquinariosDaTarefa"
                  value={maquinarioId}
                />
              ))}
              {maquinariosDropdownAberto && (
                <div className="absolute left-0 right-0 z-20 mt-1 max-h-60 overflow-y-auto rounded-base border-2 border-border bg-[#090e1d] shadow-lg">
                  {listaMaquinariosRandomizada.length === 0 ? (
                    <p className="px-3 py-2 text-sm text-muted-foreground">
                      Nenhum maquinário disponível no momento.
                    </p>
                  ) : (
                    listaMaquinariosRandomizada.map((maquinario) => {
                      if (!maquinario.id) return null
                      const checkboxId = `maquinario-option-${maquinario.id}`
                      return (
                        <div
                          key={maquinario.id}
                          className="px-3 py-2 hover:bg-black/5"
                        >
                          <label
                            htmlFor={checkboxId}
                            className="flex cursor-pointer items-center gap-2 text-sm text-foreground"
                          >
                            <Checkbox
                              id={checkboxId}
                              checked={maquinariosSelecionados.includes(
                                maquinario.id
                              )}
                              onCheckedChange={() =>
                                alternarSelecao(
                                  maquinario.id,
                                  setMaquinariosSelecionados
                                )
                              }
                            />
                            <span>{maquinario.modelo}</span>
                          </label>
                        </div>
                      )
                    })
                  )}
                </div>
              )}
            </div>
            <div className="relative">
              <Label htmlFor="funcionariosDaTarefa">
                Selecione os Funcionários da Tarefa
              </Label>
              <button
                type="button"
                id="funcionariosDaTarefa"
                className="flex h-10 w-full items-center justify-between rounded-base border-2 border-border bg-[#090e1d] px-3 py-2 text-sm font-base text-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                onClick={() =>
                  setFuncionariosDropdownAberto(
                    (previousValue) => !previousValue
                  )
                }
                aria-expanded={funcionariosDropdownAberto}
              >
                <span className="truncate text-left">
                  {descricaoFuncionariosSelecionados ||
                    'Selecione um ou mais funcionários'}
                </span>
                <svg
                  className={`h-4 w-4 transition-transform ${
                    funcionariosDropdownAberto ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {funcionariosSelecionados.map((funcionarioId) => (
                <input
                  key={`funcionario-hidden-${funcionarioId}`}
                  type="hidden"
                  name="funcionariosDaTarefa"
                  value={funcionarioId}
                />
              ))}
              {funcionariosDropdownAberto && (
                <div className="absolute left-0 right-0 z-20 mt-1 max-h-60 overflow-y-auto rounded-base border-2 border-border bg-[#090e1d] shadow-lg">
                  {listaFuncionariosRandomizada.length === 0 ? (
                    <p className="px-3 py-2 text-sm text-muted-foreground">
                      Nenhum funcionário disponível no momento.
                    </p>
                  ) : (
                    listaFuncionariosRandomizada.map((funcionario) => {
                      if (!funcionario.id) return null
                      const checkboxId = `funcionario-option-${funcionario.id}`
                      return (
                        <div
                          key={funcionario.id}
                          className="px-3 py-2 hover:bg-black/5"
                        >
                          <label
                            htmlFor={checkboxId}
                            className="flex cursor-pointer items-center gap-2 text-sm text-foreground"
                          >
                            <Checkbox
                              id={checkboxId}
                              checked={funcionariosSelecionados.includes(
                                funcionario.id
                              )}
                              onCheckedChange={() =>
                                alternarSelecao(
                                  funcionario.id,
                                  setFuncionariosSelecionados
                                )
                              }
                            />
                            <span>{funcionario.nome}</span>
                          </label>
                        </div>
                      )
                    })
                  )}
                </div>
              )}
            </div>
            <div className="relative">
              <Label htmlFor="insumosDaTarefa">
                Selecione os Insumos da Tarefa
              </Label>
              <button
                type="button"
                id="insumosDaTarefa"
                className="flex h-10 w-full items-center justify-between rounded-base border-2 border-border bg-[#090e1d] px-3 py-2 text-sm font-base text-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                onClick={() =>
                  setInsumosDropdownAberto((previousValue) => !previousValue)
                }
                aria-expanded={insumosDropdownAberto}
              >
                <span className="truncate text-left">
                  {descricaoInsumosSelecionados ||
                    'Selecione um ou mais insumos'}
                </span>
                <svg
                  className={`h-4 w-4 transition-transform ${
                    insumosDropdownAberto ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {insumosSelecionados.map((insumoId) => (
                <Fragment key={`insumo-hidden-${insumoId}`}>
                  <input
                    type="hidden"
                    name="insumosDaTarefa"
                    value={insumoId}
                  />
                  <input
                    type="hidden"
                    name={`quantidadeInsumo:${insumoId}`}
                    value={quantidadesInsumos[insumoId] ?? 1}
                  />
                </Fragment>
              ))}
              {insumosDropdownAberto && (
                <div className="absolute left-0 right-0 z-20 mt-1 max-h-60 overflow-y-auto rounded-base border-2 border-border bg-[#090e1d] shadow-lg">
                  {listaInsumosRandomizada.length === 0 ? (
                    <p className="px-3 py-2 text-sm text-muted-foreground">
                      Nenhum insumo disponível no momento.
                    </p>
                  ) : (
                    listaInsumosRandomizada.map((insumo) => {
                      if (insumo.id == undefined) return null
                      const checkboxId = `insumo-option-${insumo.id}`
                      const estaSelecionado = insumosSelecionados.includes(
                        insumo.id
                      )
                      return (
                        <div
                          key={insumo.id}
                          className="px-3 py-2 hover:bg-black/5"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <label
                              htmlFor={checkboxId}
                              className="flex cursor-pointer items-center gap-2 text-sm text-foreground"
                            >
                              <Checkbox
                                id={checkboxId}
                                checked={estaSelecionado}
                                onCheckedChange={(checked) => {
                                  if (checked === true) {
                                    setInsumosSelecionados((prevState) =>
                                      prevState.includes(insumo.id!)
                                        ? prevState
                                        : [...prevState, insumo.id!]
                                    )
                                    setQuantidadesInsumos((prevState) => ({
                                      ...prevState,
                                      [insumo.id!]: prevState[insumo.id!] ?? 1,
                                    }))
                                  } else {
                                    setInsumosSelecionados((prevState) =>
                                      prevState.filter(
                                        (item) => item !== insumo.id
                                      )
                                    )
                                    setQuantidadesInsumos((prevState) => {
                                      const atualizado = { ...prevState }
                                      delete atualizado[insumo.id!]
                                      return atualizado
                                    })
                                  }
                                }}
                              />
                              <span>{insumo.nome}</span>
                            </label>
                            {estaSelecionado && (
                              <Input
                                type="number"
                                min={1}
                                max={insumo.quantidade}
                                value={quantidadesInsumos[insumo.id] ?? 1}
                                onChange={(event) => {
                                  const novoValor = Number(event.target.value)
                                  const limite =
                                    typeof insumo.quantidade === 'number'
                                      ? insumo.quantidade
                                      : Infinity
                                  if (Number.isNaN(novoValor) || novoValor < 1)
                                    return
                                  if (
                                    novoValor > limite &&
                                    Number.isFinite(limite) &&
                                    !statusEntregueDoBD
                                  ) {
                                    setToast({
                                      title: 'Quantidade indisponível',
                                      description:
                                        'Este insumo não possui mais quantidade disponível. Remova-o da lista ou adicione novas quantidades para continuar.',
                                      variant: 'error',
                                    })
                                    atualizarQuantidadeInsumo(
                                      insumo.id!,
                                      limite
                                    )
                                    return
                                  }
                                  atualizarQuantidadeInsumo(
                                    insumo.id!,
                                    novoValor
                                  )
                                }}
                                className="h-8 w-20 px-2 text-sm"
                              />
                            )}
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              )}
            </div>
            {statusEntregueDoBD && (
              <p className="text-sm text-muted-foreground">
                Lançamento da tarefa já realizado, por favor, crie novas
                tarefas.
              </p>
            )}

            <p className="text-sm text-muted-foreground">
              Custo total: R${custoTotal}
            </p>
            <div className="flex flex-row justify-between items-center h-auto mt-2 w-full">
              <Button
                type="button"
                variant="destructive"
                onClick={(e) => {
                  const dialog = e.currentTarget.closest(
                    'dialog'
                  ) as HTMLDialogElement
                  dialog?.close()
                }}
              >
                <p className="font-semibold">CANCELAR</p>
              </Button>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="delete"
                  size="icon"
                  onClick={() => {
                    deleteDialogRef.current?.showModal()
                  }}
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </Button>
                <Button
                  type="submit"
                  variant="confirm"
                  className="min-w-[120px]"
                  disabled={statusEntregueDoBD}
                >
                  <p className="font-semibold">SALVAR</p>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
      <dialog
        ref={centroCustoDialogRef}
        className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-base bg-secondary-background p-4 shadow-lg backdrop:bg-black/50"
      >
        <div className="space-y-3">
          <p className="text-base font-semibold text-foreground">
            Selecione o Centro de Custo
          </p>
          <p className="text-sm text-muted-foreground">
            Este lançamento exige um centro de custo. Escolha uma opção para
            continuar.
          </p>
          <p className="text-sm text-muted-foreground">
            Para visualizar o custo total real da tarefa, recomendamos salvar
            todas as alterações antes de efetuar a mudança de status.
          </p>
          <p className="text-sm text-muted-foreground">
            Custo total: <b>R${custoTotal}</b>
          </p>
          <div>
            <Label htmlFor="centroCustoDialog">Centro de Custo</Label>
            <select
              id="centroCustoDialog"
              className="flex h-10 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base text-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
              value={centroCustoSelecionado}
              onChange={(event) => {
                const { value } = event.target
                setCentroCustoSelecionado(value ? Number(value) : '')
              }}
              disabled={!centrosDeCusto || centrosDeCusto.length === 0}
            >
              <option value="" disabled hidden>
                Selecione um centro de custo
              </option>
              {centrosDeCusto?.map((centro) => {
                if (!centro.id) return null
                return (
                  <option key={centro.id} value={centro.id}>
                    {centro.nome}
                  </option>
                )
              })}
            </select>
            {!centrosDeCusto || centrosDeCusto.length === 0 ? (
              <p className="mt-2 text-xs text-muted-foreground">
                Nenhum centro de custo cadastrado para esta propriedade.
              </p>
            ) : null}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                setCentroCustoSelecionado('')
                setStatus(statusAnterior ?? statusInicial)
                centroCustoDialogRef.current?.close()
              }}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="confirm"
              disabled={
                centroCustoSelecionado === '' || centrosDeCusto?.length === 0
              }
              onClick={() => {
                centroCustoDialogRef.current?.close()
                formRef.current?.requestSubmit()
              }}
            >
              Confirmar
            </Button>
          </div>
        </div>
      </dialog>
      <DialogConfirmaDelecao
        dialogRef={deleteDialogRef}
        onConfirm={async () => {
          await resultadoDeleçao()
        }}
        temCerteza="Tem certeza que deseja excluir o maquinário?"
        estaAcao="Esta ação não pode ser desfeita e significa excluir o recurso do histórico de tarefas"
      />
    </>
  )
}

function randomizarLista<T>(lista?: T[]) {
  if (!lista) return []
  const copia = [...lista]
  for (let i = copia.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}
