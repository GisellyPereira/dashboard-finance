interface Transacao {
  id: string
  nome: string
  valor: number
  data: string
  categoria: string
  tipo: 'receita' | 'despesa'
}

export const useTransacoes = () => {
  const transacoes = useState<Transacao[]>('transacoes', () => [])

  // Carregar do localStorage ao iniciar
  onMounted(() => {
    const saved = localStorage.getItem('transacoes')
    if (saved) {
      transacoes.value = JSON.parse(saved)
    }
  })

  // Salvar no localStorage quando houver mudanças
  watch(transacoes, (novasTransacoes) => {
    localStorage.setItem('transacoes', JSON.stringify(novasTransacoes))
  }, { deep: true })

  const adicionarTransacao = (transacao: Omit<Transacao, 'id'>) => {
    transacoes.value.push({
      ...transacao,
      id: Date.now().toString()
    })
  }

  const editarTransacao = (id: string, dados: Partial<Transacao>) => {
    const index = transacoes.value.findIndex(t => t.id === id)
    if (index !== -1) {
      transacoes.value[index] = { ...transacoes.value[index], ...dados }
    }
  }

  const excluirTransacao = (id: string) => {
    transacoes.value = transacoes.value.filter(t => t.id !== id)
  }

  const dadosCategoria = computed(() => {
    const dados: Record<string, number> = {}
    
    transacoes.value
      .filter(t => t.tipo === 'despesa')
      .forEach(t => {
        dados[t.categoria] = (dados[t.categoria] || 0) + t.valor
      })
      
    return Object.entries(dados).map(([categoria, valor]) => ({
      categoria,
      valor
    }))
  })

  const dadosMensais = computed(() => {
    const dados: Record<string, number> = {}
    
    transacoes.value.forEach(t => {
      const mes = new Date(t.data).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
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

  return {
    transacoes,
    adicionarTransacao,
    editarTransacao,
    excluirTransacao,
    dadosCategoria,
    dadosMensais
  }
} 