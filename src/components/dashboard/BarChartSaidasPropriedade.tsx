'use client'

import { BarChart } from '@mui/x-charts/BarChart'
import Box from '@mui/material/Box'
import { totalLancamentosPorPropriedade } from '@/app/frontend/use-cases/DashboardCases'
import { SessionContext } from '@/app/proprietario/SessionProvider'
import { useContext, useEffect, useState } from 'react'

export default function BarChartSaidasPropriedade() {
  const session = useContext(SessionContext)
  const { propriedadeSelecionadaId } = session
  const [uData, setUData] = useState<number[]>([])
  const [pData, setPData] = useState<number[]>([])
  const [xLabels, setXLabels] = useState<string[]>([])

  useEffect(() => {
    totalLancamentosPorPropriedade(propriedadeSelecionadaId ?? 0).then(
      (lancamentos) => {
        setUData(lancamentos.retornoEntrada)
        setPData(lancamentos.retornoSaida)
        setXLabels(lancamentos.meses)
      }
    )
  }, [session, propriedadeSelecionadaId])

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
      <BarChart
        grid={{ horizontal: true, vertical: true }}
        sx={{
          '.MuiChartsAxis-line': { stroke: axisColor },
          '.MuiChartsAxis-tick': { stroke: axisColor },
          '.MuiChartsGrid-line': { stroke: axisColor, opacity: 0.3 },
          '.MuiChartsLegend-label': { color: axisColor },
        }}
        series={[
          {
            data: pData,
            label: 'Saidas',
            id: 'pvId',

            yAxisId: 'leftAxisId',
          },
          {
            data: uData,
            label: 'Entradas',
            id: 'uvId',
            yAxisId: 'rightAxisId',
          },
        ]}
        xAxis={[{ data: xLabels, ...axisStyling }]}
        yAxis={[
          { id: 'leftAxisId', width: 50, ...axisStyling },
          { id: 'rightAxisId', position: 'right', ...axisStyling },
        ]}
      />
    </Box>
  )
}
