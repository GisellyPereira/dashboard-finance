<script setup lang="ts">
import { formatarMoeda } from "~/utils/formatarMoeda";
defineProps<{ value: number; signed?: boolean }>();
const { hidden } = useValuePrivacy();
const { ready } = useTransacoes();
</script>
<template>
  <span class="money" :aria-label="hidden ? 'Valor oculto' : undefined">{{
    !ready
      ? "—"
      : hidden
        ? "••••"
        : `${signed && value > 0 ? "+" : ""}${formatarMoeda(value)}`
  }}</span>
</template>
