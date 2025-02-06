<template>
  <div class="space-y-8">
    <h1 class="text-3xl font-bold">Gerenciar Transações</h1>
    
    <FormTransacao @salvar="adicionarTransacao" />
    
    <div class="bg-white rounded-lg shadow p-6">
      <ListaTransacoes 
        :transacoes="transacoes"
        @editar="editarTransacao"
        @excluir="excluirTransacao"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const { transacoes, adicionarTransacao, editarTransacao, excluirTransacao } = useTransacoes()
</script>
