import {
  categoryTotals,
  isTransacao,
  monthSeries,
  hoje,
  type NovaTransacao,
  type Transacao,
} from "~/utils/finance";

export const useTransacoes = () => {
  const transacoes = useState<Transacao[]>("transacoes", () => []);
  const ready = useState("finance-ready", () => false);
  const storageNotice = useState("finance-storage-notice", () => "");
  function adicionarTransacao(dados: NovaTransacao) {
    const item = {
      ...dados,
      nome: dados.nome.trim(),
      valor: Math.round(dados.valor * 100) / 100,
      id: crypto.randomUUID(),
    };
    if (!isTransacao(item)) throw new Error("Confira os dados da transação.");
    transacoes.value = [...transacoes.value, item];
  }
  function editarTransacao(id: string, dados: NovaTransacao) {
    const item = {
      ...dados,
      id,
      nome: dados.nome.trim(),
      valor: Math.round(dados.valor * 100) / 100,
    };
    if (!isTransacao(item)) throw new Error("Confira os dados da transação.");
    transacoes.value = transacoes.value.map((old) =>
      old.id === id ? item : old,
    );
  }
  function excluirTransacao(id: string) {
    transacoes.value = transacoes.value.filter((item) => item.id !== id);
  }
  return {
    transacoes,
    ready,
    storageNotice,
    adicionarTransacao,
    editarTransacao,
    excluirTransacao,
    dadosCategoria: computed(() => categoryTotals(transacoes.value)),
    dadosMensais: computed(() =>
      monthSeries(transacoes.value, hoje().slice(0, 7)).map((item) => ({
        mes: item.label,
        valor: item.saldo,
      })),
    ),
  };
};
