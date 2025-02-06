export const useSaldo = () => {
  const { transacoes } = useTransacoes()
  
  const saldo = computed(() => {
    return transacoes.value.reduce((acc, transacao) => {
      return acc + (transacao.tipo === 'receita' ? transacao.valor : -transacao.valor)
    }, 0)
  })

  const totalReceitas = computed(() => {
    return transacoes.value
      .filter(t => t.tipo === 'receita')
      .reduce((acc, t) => acc + t.valor, 0)
  })

  const totalDespesas = computed(() => {
    return transacoes.value
      .filter(t => t.tipo === 'despesa')
      .reduce((acc, t) => acc + t.valor, 0)
  })

  return {
    saldo,
    totalReceitas,
    totalDespesas
  }
} 