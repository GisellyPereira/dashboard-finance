<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm text-gray-600">{{ titulo }}</p>
        <p 
          class="text-2xl font-bold mt-1"
          :class="{
            'text-green-600': tipo === 'receita' || (tipo === 'saldo' && valor > 0),
            'text-red-600': tipo === 'despesa' || (tipo === 'saldo' && valor < 0),
            'text-gray-900': tipo === 'saldo' && valor === 0
          }"
        >
          {{ formatarMoeda(valor) }}
        </p>
      </div>
      <div 
        class="p-3 rounded-full"
        :class="{
          'bg-green-100': tipo === 'receita',
          'bg-red-100': tipo === 'despesa',
          'bg-blue-100': tipo === 'saldo'
        }"
      >
        <Icon 
          :name="icone" 
          class="w-6 h-6"
          :class="{
            'text-green-600': tipo === 'receita',
            'text-red-600': tipo === 'despesa',
            'text-blue-600': tipo === 'saldo'
          }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatarMoeda } from '~/utils/formatarMoeda'

const props = defineProps<{
  titulo: string
  valor: number
  tipo: 'receita' | 'despesa' | 'saldo'
}>()

const icone = computed(() => {
  switch (props.tipo) {
    case 'receita':
      return 'heroicons:arrow-trending-up'
    case 'despesa':
      return 'heroicons:arrow-trending-down'
    case 'saldo':
      return 'heroicons:banknotes'
    default:
      return ''
  }
})
</script>
