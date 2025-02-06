<template>
  <nav class="bg-white shadow">
    <div class="container mx-auto px-4">
      <div class="flex justify-between h-16">
        <div class="flex">
          <!-- Logo -->
          <div class="flex items-center">
            <NuxtLink to="/" class="text-xl font-bold text-indigo-600">
              FinançasApp
            </NuxtLink>
          </div>
          
          <!-- Links de Navegação -->
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <NuxtLink
              to="/"
              class="inline-flex items-center px-1 pt-1 text-sm font-medium"
              :class="[$route.path === '/' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700']"
            >
              Dashboard
            </NuxtLink>
            
            <NuxtLink
              to="/transacoes"
              class="inline-flex items-center px-1 pt-1 text-sm font-medium"
              :class="[$route.path === '/transacoes' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700']"
            >
              Transações
            </NuxtLink>
            
            <NuxtLink
              to="/relatorios"
              class="inline-flex items-center px-1 pt-1 text-sm font-medium"
              :class="[$route.path === '/relatorios' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700']"
            >
              Relatórios
            </NuxtLink>
          </div>
        </div>
        
        <!-- Menu Mobile -->
        <div class="sm:hidden flex items-center">
          <button
            @click="menuAberto = !menuAberto"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
          >
            <Icon
              :name="menuAberto ? 'heroicons:x-mark' : 'heroicons:bars-3'"
              class="w-6 h-6"
            />
          </button>
        </div>
      </div>
    </div>
    
    <!-- Menu Mobile Dropdown -->
    <div v-if="menuAberto" class="sm:hidden">
      <div class="pt-2 pb-3 space-y-1">
        <NuxtLink
          to="/"
          class="block pl-3 pr-4 py-2 text-base font-medium"
          :class="[$route.path === '/' ? 'text-indigo-600 bg-indigo-50 border-l-4 border-indigo-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50']"
        >
          Dashboard
        </NuxtLink>
        
        <NuxtLink
          to="/transacoes"
          class="block pl-3 pr-4 py-2 text-base font-medium"
          :class="[$route.path === '/transacoes' ? 'text-indigo-600 bg-indigo-50 border-l-4 border-indigo-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50']"
        >
          Transações
        </NuxtLink>
        
        <NuxtLink
          to="/relatorios"
          class="block pl-3 pr-4 py-2 text-base font-medium"
          :class="[$route.path === '/relatorios' ? 'text-indigo-600 bg-indigo-50 border-l-4 border-indigo-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50']"
        >
          Relatórios
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const menuAberto = ref(false)
</script>
