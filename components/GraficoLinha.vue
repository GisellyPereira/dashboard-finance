<template>
  <div class="bg-white p-6 rounded-lg shadow">
    <h3 class="text-lg font-medium mb-4">Evolução do Saldo</h3>
    <div class="h-[300px]">
      <Line
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
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { computed } from 'vue'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface DadosMensais {
  mes: string
  valor: number
}

const props = defineProps<{
  dados: DadosMensais[]
}>()

const chartData = computed(() => ({
  labels: props.dados.map(d => d.mes),
  datasets: [
    {
      label: 'Saldo',
      data: props.dados.map(d => d.valor),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
      fill: false
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value: number) => {
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
