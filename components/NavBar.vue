<script setup lang="ts">
const route = useRoute();
const { ready, storageNotice } = useTransacoes();
const links = [
  { to: "/", label: "Visão geral", icon: "overview" },
  { to: "/transacoes", label: "Transações", icon: "transactions" },
  { to: "/relatorios", label: "Relatórios", icon: "reports" },
];
</script>
<template>
  <aside class="sidebar">
    <NuxtLink to="/" class="brand" aria-label="Saldo — início"
      ><BrandMark /><span>saldo</span></NuxtLink
    >
    <nav class="main-nav" aria-label="Navegação principal">
      <NuxtLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        :aria-label="link.label"
        :aria-current="route.path === link.to ? 'page' : undefined"
        :class="{ active: route.path === link.to }"
        ><AppIcon :name="link.icon" /><span>{{ link.label }}</span></NuxtLink
      >
    </nav>
    <div class="sidebar-bottom">
      <div class="storage-status">
        <AppIcon
          :name="storageNotice ? 'info' : 'storage'"
          :size="17"
        /><span>{{
          !ready
            ? "Carregando registros"
            : storageNotice
              ? "Falha ao salvar"
              : "Registros neste navegador"
        }}</span>
      </div>
    </div>
  </aside>
</template>
