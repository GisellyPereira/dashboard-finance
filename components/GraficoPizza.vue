<script setup lang="ts">
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import { Doughnut } from "vue-chartjs";
import { formatarMoeda } from "~/utils/formatarMoeda";
ChartJS.register(ArcElement, Tooltip, Legend);
const props = defineProps<{
  dados: { categoria: string; valor: number; color: string }[];
}>();
const { hidden } = useValuePrivacy();
const reducedMotion = ref(false);
onMounted(() => {
  reducedMotion.value = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
});
const total = computed(
  () =>
    props.dados.reduce((sum, item) => sum + Math.round(item.valor * 100), 0) /
    100,
);
const chartData = computed(() => ({
  labels: props.dados.map((item) => item.categoria),
  datasets: [
    {
      data: props.dados.length ? props.dados.map((item) => item.valor) : [1],
      backgroundColor: props.dados.length
        ? props.dados.map((item) => item.color)
        : ["rgba(122, 129, 168, .12)"],
      borderWidth: 0,
      borderRadius: 6,
      spacing: 3,
      hoverOffset: 3,
    },
  ],
}));
const options = computed<ChartOptions<"doughnut">>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: "79%",
  animation: {
    duration: reducedMotion.value ? 0 : 800,
    easing: "easeOutQuart",
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      enabled: !hidden.value && props.dados.length > 0,
      backgroundColor: "#343252",
      padding: 12,
      cornerRadius: 12,
      callbacks: {
        label: (context) =>
          `${context.label}: ${formatarMoeda(Number(context.raw))}`,
      },
    },
  },
}));
const legend = computed(() => {
  if (props.dados.length <= 3) return props.dados;
  return [
    ...props.dados.slice(0, 2),
    {
      categoria: "Outras categorias",
      color: "#acb4d4",
      valor:
        props.dados
          .slice(2)
          .reduce((sum, item) => sum + Math.round(item.valor * 100), 0) / 100,
    },
  ];
});
const accessibleLabel = computed(() =>
  hidden.value
    ? "Distribuição de despesas. Valores ocultos."
    : `Despesas por categoria. ${props.dados.map((item) => `${item.categoria}: ${formatarMoeda(item.valor)}`).join(". ") || "Nenhuma despesa no período."}`,
);
</script>
<template>
  <div class="category-chart">
    <div class="donut-wrap" :class="{ 'private-chart': hidden }">
      <Doughnut
        :data="chartData"
        :options="options"
        role="img"
        :aria-label="accessibleLabel"
      />
      <div class="donut-center">
        <span>Total de saídas</span><MoneyValue :value="total" />
      </div>
    </div>
    <div v-if="dados.length" class="category-legend">
      <div v-for="item in legend" :key="item.categoria">
        <span
          ><i class="legend-dot" :style="{ background: item.color }" />{{
            item.categoria
          }}</span
        ><span>{{
          hidden ? "••" : `${Math.round((item.valor / total) * 100)}%`
        }}</span>
      </div>
    </div>
    <p v-else class="category-empty">Nenhuma saída neste período.</p>
  </div>
</template>
