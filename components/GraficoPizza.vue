<template>
  <div class="bg-white p-6 rounded-lg shadow">
    <h3 class="text-lg font-medium mb-4">Distribuição por Categoria</h3>
    <div class="h-[300px]">
      <Pie
        v-if="chartData"
        :data="chartData"
        :options="chartOptions"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'
import { Pie } from 'vue-chartjs'
import { computed } from 'vue'

ChartJS.register(ArcElement, Tooltip, Legend)

interface DadosCategoria {
  categoria: string
  valor: number
}

const props = defineProps<{
  dados: DadosCategoria[]
}>()

const chartData = computed(() => ({
  labels: props.dados.map(d => d.categoria),
  datasets: [
    {
      data: props.dados.map(d => d.valor),
      backgroundColor: [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(255, 159, 64, 0.8)',
        'rgba(231, 233, 237, 0.8)'
      ]
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: 'bottom' as const
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          const value = context.raw
          return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(value)
        }
      }
    }
  }
}
</script>
