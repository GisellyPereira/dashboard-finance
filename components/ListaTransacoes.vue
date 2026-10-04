<script setup lang="ts">
import { formatarData } from "~/utils/formatarData";
import { categoryColors, type Transacao } from "~/utils/finance";
defineProps<{ transacoes: readonly Transacao[]; compact?: boolean }>();
const { show, remove } = useTransactionEditor();
const { ready } = useTransacoes();
const iconFor = (category: string) =>
  ({
    Moradia: "home",
    Alimentação: "food",
    Transporte: "car",
    Trabalho: "work",
    Assinaturas: "subscription",
    Lazer: "coffee",
    Educação: "book",
    Saúde: "health",
  })[category] || "other";
</script>
<template>
  <div class="transaction-list" :class="{ compact }">
    <table v-if="transacoes.length" aria-label="Transações do período">
      <thead>
        <tr>
          <th>Descrição</th>
          <th class="category-column">Categoria</th>
          <th class="date-column">Data</th>
          <th class="amount-column">Valor</th>
          <th v-if="!compact" class="actions-column">
            <span class="sr-only">Ações</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in transacoes" :key="item.id">
          <td>
            <div class="transaction-description">
              <span
                class="category-icon"
                :style="{
                  '--category-color':
                    categoryColors[item.categoria] || '#a3aec7',
                }"
                ><AppIcon :name="iconFor(item.categoria)" :size="19"
              /></span>
              <div>
                <button
                  class="transaction-name"
                  :aria-label="`Editar ${item.nome}`"
                  @click="show(item)"
                >
                  {{ item.nome }}</button
                ><span class="transaction-meta"
                  >{{ item.tipo === "receita" ? "Receita" : "Despesa"
                  }}<span class="mobile-date">
                    · {{ formatarData(item.data) }}</span
                  ></span
                >
              </div>
            </div>
          </td>
          <td class="category-column">
            <span class="category-text">{{ item.categoria }}</span>
          </td>
          <td class="date-column">{{ formatarData(item.data) }}</td>
          <td class="amount-column" :class="item.tipo">
            <MoneyValue
              :value="item.tipo === 'receita' ? item.valor : -item.valor"
              signed
            />
          </td>
          <td v-if="!compact" class="actions-column">
            <button
              class="icon-button delete-button"
              :aria-label="`Excluir ${item.nome}`"
              @click="remove(item)"
            >
              <AppIcon name="trash" :size="17" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else class="empty-state">
      <div>
        <h3>
          {{ ready ? "Nenhuma transação no período" : "Carregando registros…" }}
        </h3>
        <p v-if="ready">Adicione um registro ou selecione outro período.</p>
      </div>
      <button v-if="ready" class="button button-light" @click="show()">
        Adicionar transação
      </button>
    </div>
  </div>
</template>
