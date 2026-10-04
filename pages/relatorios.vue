<script setup lang="ts">
import {
  forMonth,
  summarize,
  monthSeries,
  categoryTotals,
  recentTransactions,
  hoje,
  toCsv,
} from "~/utils/finance";
useHead({ title: "Relatórios · Saldo" });
const { transacoes, ready } = useTransacoes();
const { selectedMonth } = useFinancePeriod();
const category = ref("");
const type = ref("");
const categories = computed(() =>
  [...new Set(transacoes.value.map((item) => item.categoria))].sort(),
);
const selection = computed(() =>
  transacoes.value.filter(
    (item) =>
      (!category.value || item.categoria === category.value) &&
      (!type.value || item.tipo === type.value),
  ),
);
const filtered = computed(() =>
  recentTransactions(forMonth(selection.value, selectedMonth.value)),
);
const summary = computed(() => summarize(filtered.value));
const distribution = computed(() => categoryTotals(filtered.value));
const series = computed(() =>
  monthSeries(selection.value, selectedMonth.value || hoje().slice(0, 7)),
);
const hasHistory = computed(() =>
  series.value.some((item) => item.receitas || item.despesas),
);
function exportCsv() {
  const url = URL.createObjectURL(
    new Blob([toCsv(filtered.value)], { type: "text/csv;charset=utf-8" }),
  );
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `saldo-${selectedMonth.value || "todos-os-registros"}.csv`;
  anchor.hidden = true;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  useFinanceNotification().notify("Relatório exportado.");
}
</script>
<template>
  <div>
    <PageHeader
      title="Relatórios"
      allow-all
      exportable
      :export-disabled="!filtered.length"
      @export="exportCsv"
    />
    <div class="report-filters">
      <label class="form-field inline-field"
        >Categoria<select v-model="category">
          <option value="">Todas as categorias</option>
          <option v-for="item in categories" :key="item">{{ item }}</option>
        </select></label
      ><label class="form-field inline-field"
        >Movimentação<select v-model="type">
          <option value="">Entradas e saídas</option>
          <option value="receita">Só entradas</option>
          <option value="despesa">Só saídas</option>
        </select></label
      ><button
        v-if="category || type"
        class="text-link"
        @click="
          category = '';
          type = '';
        "
      >
        Limpar filtros
      </button>
    </div>
    <section class="glass report-summary" aria-label="Resumo da seleção">
      <div><span>Entradas</span><MoneyValue :value="summary.receitas" /></div>
      <div><span>Saídas</span><MoneyValue :value="summary.despesas" /></div>
      <div>
        <span>Saldo da seleção</span><MoneyValue :value="summary.saldo" />
      </div>
      <span class="report-count"
        >{{ filtered.length }} registros<br />nesta seleção</span
      >
    </section>
    <div class="report-grid">
      <section class="glass evolution-panel">
        <div class="panel-heading">
          <div>
            <h2>Movimentação mensal</h2>
            <p>Seis meses até o período escolhido</p>
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
                  ? "Nenhuma movimentação nesta seleção"
                  : "Carregando registros…"
              }}
            </p>
          </div></ClientOnly
        >
      </section>
      <section class="glass category-panel">
        <div class="panel-heading">
          <div>
            <h2>Distribuição das saídas</h2>
            <p>Categoria por categoria</p>
          </div>
        </div>
        <ClientOnly
          ><GraficoPizza v-if="distribution.length" :dados="distribution" />
          <div v-else class="chart-empty">
            <p>
              {{
                ready
                  ? "Nenhuma despesa nesta seleção"
                  : "Carregando registros…"
              }}
            </p>
          </div></ClientOnly
        >
      </section>
    </div>
    <section class="glass report-records">
      <div class="panel-heading">
        <div>
          <h2>Registros da seleção</h2>
          <p>Os dados que compõem este relatório</p>
        </div>
      </div>
      <ListaTransacoes :transacoes="filtered" />
    </section>
  </div>
</template>
