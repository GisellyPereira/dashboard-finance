<script setup lang="ts">
defineProps<{
  saldo: number;
  receitas: number;
  despesas: number;
  count: number;
}>();
</script>
<template>
  <section class="financial-summary" aria-label="Resumo financeiro do período">
    <div class="summary-item balance-total">
      <span>Saldo do período</span
      ><MoneyValue :value="saldo" :class="{ negative: saldo < 0 }" />
    </div>
    <div class="summary-item">
      <span><i class="legend-dot income-dot" />Entradas</span
      ><MoneyValue :value="receitas" class="income-value" />
    </div>
    <div class="summary-item">
      <span><i class="legend-dot expense-dot" />Saídas</span
      ><MoneyValue :value="despesas" />
    </div>
    <span class="summary-count"
      >{{ count }} {{ count === 1 ? "transação" : "transações" }}<br />no
      período</span
    >
  </section>
</template>
