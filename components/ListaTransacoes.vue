<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Nome
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Valor
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Data
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Categoria
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Tipo
          </th>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Ações
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="transacao in transacoes" :key="transacao.id">
          <td class="px-6 py-4 whitespace-nowrap">{{ transacao.nome }}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span :class="transacao.tipo === 'receita' ? 'text-green-600' : 'text-red-600'">
              {{ formatarMoeda(transacao.valor) }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">{{ formatarData(transacao.data) }}</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ transacao.categoria }}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span
              :class="[
                'px-2 py-1 text-xs rounded-full',
                transacao.tipo === 'receita' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              ]"
            >
              {{ transacao.tipo }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button
              @click="$emit('editar', transacao)"
              class="text-indigo-600 hover:text-indigo-900 mr-3"
            >
              Editar
            </button>
            <button
              @click="$emit('excluir', transacao.id)"
              class="text-red-600 hover:text-red-900"
            >
              Excluir
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { formatarMoeda } from '~/utils/formatarMoeda'
import { formatarData } from '~/utils/formatarData'

interface Transacao {
  id: string
  nome: string
  valor: number
  data: string
  categoria: string
  tipo: 'receita' | 'despesa'
}

defineProps<{
  transacoes: Transacao[]
}>()

defineEmits<{
  (e: 'editar', transacao: Transacao): void
  (e: 'excluir', id: string): void
}>()
</script>
