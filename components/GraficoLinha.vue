<script setup lang="ts">
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  type ChartOptions,
  type ScriptableContext,
} from "chart.js";
import { Line } from "vue-chartjs";
import { formatarMoeda } from "~/utils/formatarMoeda";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);
const props = defineProps<{
  dados: { month: string; label: string; receitas: number; despesas: number }[];
}>();
const { hidden } = useValuePrivacy();
const axisFormat = new Intl.NumberFormat("pt-BR", {
  notation: "compact",
  maximumFractionDigits: 1,
});
const reducedMotion = ref(false);
onMounted(() => {
  reducedMotion.value = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
});
function shade(context: ScriptableContext<"line">) {
  const { ctx, chartArea } = context.chart;
  if (!chartArea) return "rgba(112, 122, 212, .1)";
  const gradient = ctx.createLinearGradient(
    0,
    chartArea.top,
    0,
    chartArea.bottom,
  );
  gradient.addColorStop(0, "rgba(124, 138, 219, .19)");
  gradient.addColorStop(1, "rgba(124, 138, 219, 0)");
  return gradient;
}
const chartData = computed(() => ({
  labels: props.dados.map((item) => item.label),
  datasets: [
    {
      label: "Entradas",
      data: props.dados.map((item) => item.receitas),
      borderColor: "#7378cc",
      backgroundColor: shade,
      fill: true,
      borderWidth: 2.5,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "#7378cc",
      pointHoverBorderColor: "#fff",
      pointHoverBorderWidth: 3,
    },
    {
      label: "Saídas",
      data: props.dados.map((item) => item.despesas),
      borderColor: "#d292ae",
      backgroundColor: "transparent",
      fill: false,
      borderWidth: 2.5,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "#d292ae",
      pointHoverBorderColor: "#fff",
      pointHoverBorderWidth: 3,
    },
  ],
}));
const options = computed<ChartOptions<"line">>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: reducedMotion.value ? 0 : 700,
    easing: "easeOutQuart",
  },
  interaction: { mode: "index", intersect: false },
  layout: { padding: { top: 8, right: 8 } },
  plugins: {
    legend: { display: false },
    tooltip: {
      enabled: !hidden.value,
      backgroundColor: "#343252",
      titleFont: { family: "Manrope", weight: 600 },
      bodyFont: { family: "Manrope" },
      padding: 13,
      cornerRadius: 12,
      displayColors: true,
      boxPadding: 5,
      callbacks: {
        label: (context) =>
          `${context.dataset.label}: ${formatarMoeda(Number(context.raw))}`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: {
        color: "#747b91",
        font: { family: "Manrope", size: 11 },
        padding: 8,
      },
    },
    y: {
      beginAtZero: true,
      grid: { color: "rgba(96, 104, 142, .07)", drawTicks: false },
      border: { display: false },
      ticks: {
        maxTicksLimit: 4,
        padding: 12,
        color: "#7b718a",
        font: { family: "Manrope", size: 10 },
        callback: (value) =>
          hidden.value ? "••" : axisFormat.format(Number(value)),
      },
    },
  },
}));
const accessibleLabel = computed(() =>
  hidden.value
    ? "Gráfico de movimentação. Os valores estão ocultos."
    : `Entradas e saídas por mês. ${props.dados.map((item) => `${item.month}: entradas ${formatarMoeda(item.receitas)}, saídas ${formatarMoeda(item.despesas)}`).join(". ")}`,
);
</script>
<template>
  <div class="line-chart" :class="{ 'private-chart': hidden }">
    <Line
      :data="chartData"
      :options="options"
      role="img"
      :aria-label="accessibleLabel"
    />
    <div v-if="hidden" class="private-chart-label">Valores ocultos</div>
  </div>
</template>
