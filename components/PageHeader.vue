<script setup lang="ts">
import { monthLabel } from "~/utils/finance";
defineProps<{
  title: string;
  allowAll?: boolean;
  exportable?: boolean;
  exportDisabled?: boolean;
}>();
defineEmits<{ export: [] }>();
const { selectedMonth, months, label } = useFinancePeriod();
const { hidden, toggle } = useValuePrivacy();
const { ready } = useTransacoes();
const { show } = useTransactionEditor();
</script>
<template>
  <header class="page-header">
    <div class="page-heading">
      <div class="title-line">
        <h1>{{ title }}</h1>
      </div>
      <p>{{ label }}</p>
    </div>
    <div class="header-actions">
      <button
        class="icon-button privacy-button"
        :aria-label="hidden ? 'Mostrar valores' : 'Ocultar valores'"
        :aria-pressed="hidden"
        @click="toggle"
      >
        <AppIcon :name="hidden ? 'eye-off' : 'eye'" />
      </button>
      <div class="period-select">
        <AppIcon name="calendar" :size="17" /><select
          v-model="selectedMonth"
          aria-label="Período"
        >
          <option v-if="allowAll" value="">Todo o período</option>
          <option v-for="month in months" :key="month" :value="month">
            {{ monthLabel(month) }}
          </option></select
        ><AppIcon name="chevron" :size="14" />
      </div>
      <button
        v-if="exportable"
        class="button button-light export-button"
        :disabled="exportDisabled || !ready"
        @click="$emit('export')"
      >
        <AppIcon name="download" :size="18" /><span>Exportar CSV</span>
      </button>
      <button
        v-else
        data-new-transaction
        class="button button-primary"
        :disabled="!ready"
        @click="show()"
      >
        <AppIcon name="plus" :size="18" /><span>Nova transação</span>
      </button>
    </div>
  </header>
</template>
