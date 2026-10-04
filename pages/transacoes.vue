<script setup lang="ts">
import { forMonth, summarize, recentTransactions } from "~/utils/finance";
useHead({ title: "Transações · Saldo" });
const { transacoes } = useTransacoes();
const { selectedMonth } = useFinancePeriod();
const search = ref("");
const type = ref("");
const period = computed(() => forMonth(transacoes.value, selectedMonth.value));
const filtered = computed(() =>
  recentTransactions(
    period.value.filter(
      (item) =>
        (!type.value || item.tipo === type.value) &&
        `${item.nome} ${item.categoria}`
          .toLocaleLowerCase("pt-BR")
          .includes(search.value.trim().toLocaleLowerCase("pt-BR")),
    ),
  ),
);
const summary = computed(() => summarize(filtered.value));
</script>
<template>
  <div>
    <PageHeader title="Transações" allow-all />
    <section class="glass records-panel">
      <div class="records-toolbar">
        <div class="segmented" role="group" aria-label="Filtrar por tipo">
          <button
            v-for="option in [
              { value: '', label: 'Todas' },
              { value: 'receita', label: 'Entradas' },
              { value: 'despesa', label: 'Saídas' },
            ]"
            :key="option.value"
            :class="{ selected: type === option.value }"
            :aria-pressed="type === option.value"
            @click="type = option.value"
          >
            {{ option.label }}
          </button>
        </div>
        <label class="search-field"
          ><AppIcon name="search" :size="18" /><input
            v-model="search"
            type="search"
            aria-label="Buscar transações"
            placeholder="Buscar nome ou categoria"
        /></label>
      </div>
      <div class="records-summary">
        <span
          >{{ filtered.length }}
          {{ filtered.length === 1 ? "registro" : "registros" }}</span
        ><span>Saldo desta seleção <MoneyValue :value="summary.saldo" /></span>
      </div>
      <ListaTransacoes :transacoes="filtered" />
      <button
        v-if="!filtered.length && (search || type)"
        class="text-link clear-filters"
        @click="
          search = '';
          type = '';
        "
      >
        Limpar filtros
      </button>
    </section>
  </div>
</template>
