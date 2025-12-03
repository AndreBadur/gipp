'use client'

import BarChartSaidasPropriedade from '@/components/dashboard/BarChartSaidasPropriedade'
import LineChartCustoRecursos from '@/components/dashboard/LineChartCustoRecursos'

export default function Page() {
  return (
    <div className="flex flex-col">
      <p>Entradas e saídas da propriedade no último ano</p>
      <BarChartSaidasPropriedade />
      <p>Custo dos recursos no último ano</p>
      <LineChartCustoRecursos />
    </div>
  )
}
