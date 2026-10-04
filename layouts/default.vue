<script setup lang="ts">
const { storageNotice } = useTransacoes();
</script>
<template>
  <div class="app-shell">
    <NavBar />
    <main id="conteudo" class="main-content">
      <p v-if="storageNotice" class="storage-warning" role="status">
        <AppIcon name="info" />{{ storageNotice }}
      </p>
      <slot />
    </main>
    <ClientOnly><TransactionEditor /><AppToast /></ClientOnly>
  </div>
</template>
