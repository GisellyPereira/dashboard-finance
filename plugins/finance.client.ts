import { readPersonalTransactions } from "~/utils/finance";

export default defineNuxtPlugin(() => {
  const { transacoes, ready, storageNotice } = useTransacoes();
  onNuxtReady(() => {
    let originalToPreserve: string | null = null;
    let backupKind = "backup";
    try {
      const raw = localStorage.getItem("transacoes");
      const legacyExamples = localStorage.getItem("saldo.demo") === "true";
      try {
        transacoes.value = readPersonalTransactions(raw, legacyExamples);
        if (raw !== null && legacyExamples) {
          originalToPreserve = raw;
          backupKind = "previous-demo";
        }
      } catch {
        originalToPreserve = raw;
        storageNotice.value =
          "Não foi possível abrir os registros salvos. Uma cópia será preservada antes de salvar novos registros.";
      }
    } catch {
      storageNotice.value =
        "O armazenamento está indisponível. Os registros desta sessão não serão mantidos ao fechar a página.";
    }
    ready.value = true;
    const persist = () => {
      try {
        if (originalToPreserve !== null) {
          localStorage.setItem(
            `saldo.${backupKind}.${Date.now()}`,
            originalToPreserve,
          );
          originalToPreserve = null;
        }
        localStorage.setItem("transacoes", JSON.stringify(transacoes.value));
        localStorage.removeItem("saldo.demo");
      } catch {
        storageNotice.value =
          "Não foi possível salvar neste navegador. Mantenha a página aberta e exporte seus registros pelos relatórios.";
      }
    };
    if (!storageNotice.value) persist();
    watch(transacoes, persist, { deep: true });
  });
});
