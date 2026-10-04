<script setup lang="ts">
import { categorias, hoje, type NovaTransacao } from "~/utils/finance";
const dialog = ref<HTMLDialogElement>();
const { open, selected, action, close } = useTransactionEditor();
const { adicionarTransacao, editarTransacao, excluirTransacao } =
  useTransacoes();
const { notify } = useFinanceNotification();
const form = reactive<NovaTransacao>({
  nome: "",
  valor: 0,
  data: hoje(),
  categoria: "Outros",
  tipo: "despesa",
});
const error = ref("");
let previousOverflow = "";
let trigger: HTMLElement | null = null;
watch(open, async (isOpen) => {
  await nextTick();
  if (isOpen && dialog.value && !dialog.value.open) {
    error.value = "";
    Object.assign(
      form,
      selected.value || {
        nome: "",
        valor: "",
        data: hoje(),
        categoria: "Outros",
        tipo: "despesa",
      },
    );
    trigger =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.value.showModal();
  } else if (!isOpen && dialog.value?.open) dialog.value.close();
});
function afterClose() {
  close();
  document.body.style.overflow = previousOverflow;
  const target = trigger?.isConnected
    ? trigger
    : document.querySelector<HTMLElement>("[data-new-transaction]");
  target?.focus({ preventScroll: true });
}
function save() {
  try {
    const dados = { ...form, valor: Number(form.valor) };
    if (selected.value) editarTransacao(selected.value.id, dados);
    else adicionarTransacao(dados);
    notify(selected.value ? "Transação atualizada." : "Transação salva.");
    close();
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : "Confira os dados.";
  }
}
function confirmDelete() {
  if (!selected.value) return;
  excluirTransacao(selected.value.id);
  notify("Transação excluída.");
  close();
}
onBeforeUnmount(() => {
  if (dialog.value?.open) {
    document.body.style.overflow = previousOverflow;
    dialog.value.close();
  }
});
</script>
<template>
  <Teleport to="body">
    <dialog
      ref="dialog"
      class="transaction-dialog"
      aria-labelledby="editor-title"
      @close="afterClose"
      @click="
        (event) => {
          if (event.target === dialog) close();
        }
      "
    >
      <div class="editor-inner">
        <button
          class="icon-button editor-close"
          aria-label="Fechar"
          @click="close"
        >
          <AppIcon name="close" />
        </button>
        <template v-if="action === 'delete'">
          <span class="dialog-kicker">Remover registro</span>
          <h2 id="editor-title">Excluir esta transação?</h2>
          <p class="dialog-description">
            “{{ selected?.nome }}” será removida dos registros.
          </p>
          <div class="editor-buttons">
            <button class="button button-light" autofocus @click="close">
              Cancelar</button
            ><button class="button button-danger" @click="confirmDelete">
              Excluir transação
            </button>
          </div>
        </template>
        <template v-else>
          <span class="dialog-kicker">Seus registros</span>
          <h2 id="editor-title">
            {{ selected ? "Editar transação" : "Nova transação" }}
          </h2>
          <form @submit.prevent="save">
            <div
              class="type-toggle"
              role="group"
              aria-label="Tipo de transação"
            >
              <button
                type="button"
                :aria-pressed="form.tipo === 'despesa'"
                :class="{ selected: form.tipo === 'despesa' }"
                @click="form.tipo = 'despesa'"
              >
                Despesa</button
              ><button
                type="button"
                :aria-pressed="form.tipo === 'receita'"
                :class="{ selected: form.tipo === 'receita' }"
                @click="form.tipo = 'receita'"
              >
                Receita
              </button>
            </div>
            <label class="form-field amount-field"
              >Valor
              <span class="amount-input"
                ><span>R$</span
                ><input
                  v-model="form.valor"
                  type="number"
                  min="0.01"
                  max="999999999"
                  step="0.01"
                  required
                  placeholder="0,00"
                  inputmode="decimal"
                  name="valor" /></span
            ></label>
            <label class="form-field"
              >Descrição<input
                v-model="form.nome"
                type="text"
                required
                maxlength="80"
                placeholder="Ex.: supermercado"
                name="nome"
            /></label>
            <div class="form-grid">
              <label class="form-field"
                >Data<input
                  v-model="form.data"
                  type="date"
                  required
                  name="data" /></label
              ><label class="form-field"
                >Categoria<select v-model="form.categoria" name="categoria">
                  <option
                    v-if="
                      !categorias.includes(
                        form.categoria as (typeof categorias)[number],
                      )
                    "
                    :value="form.categoria"
                  >
                    {{ form.categoria }}
                  </option>
                  <option v-for="category in categorias" :key="category">
                    {{ category }}
                  </option>
                </select></label
              >
            </div>
            <p v-if="error" class="form-error" role="alert">{{ error }}</p>
            <div class="editor-buttons">
              <button type="button" class="button button-light" @click="close">
                Cancelar</button
              ><button type="submit" class="button button-primary">
                {{ selected ? "Salvar alterações" : "Salvar transação" }}
              </button>
            </div>
          </form>
        </template>
      </div>
    </dialog>
  </Teleport>
</template>
