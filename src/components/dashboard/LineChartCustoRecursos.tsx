'use client'

import { custoDeRecursosTotais } from '@/app/frontend/use-cases/DashboardCases'
import { SessionContext } from '@/app/proprietario/SessionProvider'
import Box from '@mui/material/Box'
import { LineChart } from '@mui/x-charts/LineChart'
import { useContext, useEffect, useState } from 'react'

export default function LineChartCustoRecursos() {
  const [arrayMaquinarios, setArrayMaquinarios] = useState<number[]>([])
  const [arrayFuncionarios, setArrayFuncionarios] = useState<number[]>([])
  const [arrayInsumos, setArrayInsumos] = useState<number[]>([])
  const [meses, setMeses] = useState<string[]>([])

  const session = useContext(SessionContext)
  const { propriedadeSelecionadaId, idProprietario } = session

  useEffect(() => {
    let isMounted = true

    custoDeRecursosTotais(
      propriedadeSelecionadaId ?? 0,
      idProprietario ?? 0
    ).then((data) => {
      if (!isMounted || !data) return
      setArrayMaquinarios(data.custoTotalMaquinarios)
      setArrayFuncionarios(data.custoTotalFuncionarios)
      setArrayInsumos(data.custoTotalInsumos)
      setMeses(data.meses)
    })

    return () => {
      isMounted = false
    }
  }, [propriedadeSelecionadaId, idProprietario])

  const margin = { right: 24 }
  const mData = arrayMaquinarios
  const fData = arrayFuncionarios
  const iData = arrayInsumos
  const xLabels = meses
  const axisColor = 'hsl(var(--foreground))'
  const axisStyling = {
    tickLabelStyle: { fill: axisColor },
    labelStyle: { fill: axisColor },
    slotProps: {
      axisLine: { stroke: axisColor },
      axisTick: { stroke: axisColor },
      axisLabel: { style: { fill: axisColor } },
      axisTickLabel: { style: { fill: axisColor } },
    },
  }

  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <LineChart
        grid={{ horizontal: true, vertical: true }}
        sx={{
          '.MuiChartsAxis-line': { stroke: axisColor },
          '.MuiChartsAxis-tick': { stroke: axisColor },
          '.MuiChartsGrid-line': { stroke: axisColor, opacity: 0.3 },
          '.MuiChartsLegend-label': { color: axisColor },
        }}
        series={[
          { data: mData, label: 'Maquinários' },
          { data: fData, label: 'Funcionários' },
          { data: iData, label: 'Insumos' },
        ]}
        xAxis={[{ scaleType: 'point', data: xLabels, ...axisStyling }]}
        yAxis={[{ width: 50, ...axisStyling }]}
        margin={margin}
      />
    </Box>
  )
}
