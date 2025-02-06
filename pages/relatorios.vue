<template>
  <div class="space-y-8">
    <h1 class="text-3xl font-bold">Relatórios</h1>
    
    <!-- Filtros -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <select
        v-model="filtroMes"
        class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      >
        <option value="">Todos os Meses</option>
        <option v-for="mes in mesesDisponiveis" :key="mes" :value="mes">
          {{ mes }}
        </option>
      </select>
      
      <select
        v-model="filtroCategoria"
        class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      >
        <option value="">Todas as Categorias</option>
        <option v-for="categoria in categoriasDisponiveis" :key="categoria" :value="categoria">
          {{ categoria }}
        </option>
      </select>
      
      <select
        v-model="filtroTipo"
        class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      >
        <option value="">Todos os Tipos</option>
        <option value="receita">Receitas</option>
        <option value="despesa">Despesas</option>
      </select>
    </div>
    
    <!-- Gráficos -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <GraficoPizza :dados="dadosCategoriaFiltrados" />
      <GraficoLinha :dados="evolucaoMensalFiltrada" />
    </div>
    
    <!-- Lista de Transações Filtradas -->
    <ListaTransacoes :transacoes="transacoesFiltradas" />
  </div>
</template>

<script setup lang="ts">
const filtroMes = ref('')
const filtroCategoria = ref('')
const filtroTipo = ref('')

const { transacoes } = useTransacoes()

// Obter meses únicos das transações
const mesesDisponiveis = computed(() => {
  const meses = new Set(
    transacoes.value.map(t => 
      new Date(t.data).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    )
  )
  return Array.from(meses).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  )
})

// Obter categorias únicas das transações
const categoriasDisponiveis = computed(() => {
  const categorias = new Set(transacoes.value.map(t => t.categoria))
  return Array.from(categorias).sort()
})

// Filtrar transações
const transacoesFiltradas = computed(() => {
  return transacoes.value.filter(transacao => {
    const mesTransacao = new Date(transacao.data).toLocaleDateString('pt-BR', { 
      month: 'long', 
      year: 'numeric' 
    })
    
    const passaFiltroMes = !filtroMes.value || mesTransacao === filtroMes.value
    const passaFiltroCategoria = !filtroCategoria.value || transacao.categoria === filtroCategoria.value
    const passaFiltroTipo = !filtroTipo.value || transacao.tipo === filtroTipo.value
    
    return passaFiltroMes && passaFiltroCategoria && passaFiltroTipo
  })
})

// Dados para o gráfico de pizza (categorias)
const dadosCategoriaFiltrados = computed(() => {
  const dados: Record<string, number> = {}
  
  transacoesFiltradas.value
    .filter(t => t.tipo === 'despesa')
    .forEach(t => {
      dados[t.categoria] = (dados[t.categoria] || 0) + t.valor
    })
    
  return Object.entries(dados).map(([categoria, valor]) => ({
    categoria,
    valor
  }))
})

// Dados para o gráfico de linha (evolução mensal)
const evolucaoMensalFiltrada = computed(() => {
  const dados: Record<string, number> = {}
  
  transacoesFiltradas.value.forEach(t => {
    const mes = new Date(t.data).toLocaleDateString('pt-BR', { 
      month: 'short', 
      year: 'numeric' 
    })
    const valor = t.tipo === 'receita' ? t.valor : -t.valor
    dados[mes] = (dados[mes] || 0) + valor
  })
  
  return Object.entries(dados)
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .map(([mes, valor]) => ({
      mes,
      valor
    }))
})
</script>
