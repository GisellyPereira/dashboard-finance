<template>
  <form @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow p-6 mb-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Nome
        </label>
        <input
          v-model="form.nome"
          type="text"
          required
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Valor
        </label>
        <input
          v-model.number="form.valor"
          type="number"
          step="0.01"
          required
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Data
        </label>
        <input
          v-model="form.data"
          type="date"
          required
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Categoria
        </label>
        <select
          v-model="form.categoria"
          required
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Selecione uma categoria</option>
          <option value="Alimentação">Alimentação</option>
          <option value="Transporte">Transporte</option>
          <option value="Moradia">Moradia</option>
          <option value="Lazer">Lazer</option>
          <option value="Saúde">Saúde</option>
          <option value="Educação">Educação</option>
          <option value="Outros">Outros</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Tipo
        </label>
        <select
          v-model="form.tipo"
          required
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Selecione o tipo</option>
          <option value="receita">Receita</option>
          <option value="despesa">Despesa</option>
        </select>
      </div>
    </div>

    <div class="mt-6">
      <button
        type="submit"
        class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Salvar Transação
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
const form = reactive({
  nome: '',
  valor: 0,
  data: '',
  categoria: '',
  tipo: '' as 'receita' | 'despesa' | ''
})

const emit = defineEmits<{
  (e: 'salvar', transacao: {
    nome: string
    valor: number
    data: string
    categoria: string
    tipo: 'receita' | 'despesa'
  }): void
}>()

const handleSubmit = () => {
  if (form.tipo === '') return

  emit('salvar', {
    nome: form.nome,
    valor: form.valor,
    data: form.data,
    categoria: form.categoria,
    tipo: form.tipo
  })

  // Limpar formulário
  form.nome = ''
  form.valor = 0
  form.data = ''
  form.categoria = ''
  form.tipo = ''
}
</script>
