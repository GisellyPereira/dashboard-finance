<template>
  <div class="space-y-8">
    <!-- Cards de Resumo -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <CardResumo titulo="Saldo Atual" :valor="saldo" tipo="saldo" />
      <CardResumo titulo="Total Receitas" :valor="totalReceitas" tipo="receita" />
      <CardResumo titulo="Total Despesas" :valor="totalDespesas" tipo="despesa" />
    </div>
    
    <!-- Gráficos -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <GraficoPizza :dados="dadosCategoria" />
      <GraficoLinha :dados="dadosMensais" />
    </div>
    
    <!-- Últimas Transações -->
    <div>
      <h2 class="text-2xl font-bold mb-4">Últimas Transações</h2>
      <ListaTransacoes :transacoes="transacoesRecentes" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { saldo, totalReceitas, totalDespesas } = useSaldo()
const { transacoes, dadosCategoria, dadosMensais } = useTransacoes()

const transacoesRecentes = computed(() => {
  return transacoes.value.slice(0, 5) // Mostra apenas as 5 últimas transações
})
</script>
