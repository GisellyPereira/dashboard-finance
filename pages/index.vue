<script setup lang="ts">
import {
  forMonth,
  summarize,
  monthSeries,
  categoryTotals,
  recentTransactions,
  hoje,
} from "~/utils/finance";
useHead({ title: "Visão geral · Saldo" });
const { transacoes, ready } = useTransacoes();
const { selectedMonth } = useFinancePeriod();
if (!selectedMonth.value) selectedMonth.value = hoje().slice(0, 7);
const period = computed(() => forMonth(transacoes.value, selectedMonth.value));
const summary = computed(() => summarize(period.value));
const series = computed(() =>
  monthSeries(transacoes.value, selectedMonth.value),
);
const hasHistory = computed(() =>
  series.value.some((item) => item.receitas || item.despesas),
);
const categories = computed(() => categoryTotals(period.value));
const recent = computed(() => recentTransactions(period.value).slice(0, 6));
</script>
<template>
  <div class="overview-page">
    <PageHeader title="Visão geral" />
    <BalancePanel v-bind="summary" :count="period.length" />
    <div class="overview-grid">
      <section class="glass evolution-panel">
        <div class="panel-heading">
          <div>
            <h2>Entradas e saídas</h2>
            <p>Movimentação dos últimos seis meses</p>
          </div>
          <div class="chart-legend">
            <span><i class="legend-dot income-dot" />Entradas</span
            ><span><i class="legend-dot expense-dot" />Saídas</span>
          </div>
        </div>
        <ClientOnly
          ><GraficoLinha v-if="hasHistory" :dados="series" />
          <div v-else class="chart-empty">
            <p>
              {{
                ready
                  ? "Nenhuma movimentação neste período"
                  : "Carregando registros…"
              }}
            </p>
            <span v-if="ready"
              >O gráfico acompanha as transações que você registrar.</span
            >
          </div></ClientOnly
        >
      </section>
      <section class="glass category-panel">
        <div class="panel-heading">
          <div>
            <h2>Despesas por categoria</h2>
            <p>
              {{
                categories.length
                  ? "Distribuição no período selecionado"
                  : "Acompanhe onde você está gastando"
              }}
            </p>
          </div>
        </div>
        <ClientOnly
          ><GraficoPizza v-if="categories.length" :dados="categories" />
          <div v-else class="chart-empty">
            <p>
              {{
                ready ? "Nenhuma despesa registrada" : "Carregando registros…"
              }}
            </p>
            <span v-if="ready"
              >As categorias aparecem com suas primeiras despesas.</span
            >
          </div></ClientOnly
        >
      </section>
      <section class="glass recent-panel">
        <div class="panel-heading">
          <div>
            <h2>Últimas transações</h2>
            <p>Registros do período selecionado</p>
          </div>
          <NuxtLink to="/transacoes" class="text-link">Ver todas</NuxtLink>
        </div>
        <ListaTransacoes :transacoes="recent" compact />
      </section>
    </div>
  </div>
</template>
