export interface Transacao {
  id: string;
  nome: string;
  valor: number;
  data: string;
  categoria: string;
  tipo: "receita" | "despesa";
}
export type NovaTransacao = Omit<Transacao, "id">;
export const categorias = [
  "Alimentação",
  "Moradia",
  "Transporte",
  "Assinaturas",
  "Lazer",
  "Saúde",
  "Educação",
  "Trabalho",
  "Outros",
] as const;
export const categoryColors: Record<string, string> = {
  Moradia: "#8070d5",
  Alimentação: "#79b7eb",
  Transporte: "#c299d9",
  Assinaturas: "#e29ab1",
  Lazer: "#6592cc",
  Saúde: "#c28cbc",
  Educação: "#8999df",
  Trabalho: "#6f8ed0",
  Outros: "#a3aec7",
};
export function hoje(): string {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00`);
  return (
    Number.isFinite(date.getTime()) &&
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}` ===
      value
  );
}
export function isTransacao(value: unknown): value is Transacao {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<Transacao>;
  return (
    typeof item.id === "string" &&
    typeof item.nome === "string" &&
    item.nome.trim().length > 0 &&
    typeof item.valor === "number" &&
    Number.isFinite(item.valor) &&
    item.valor > 0 &&
    typeof item.data === "string" &&
    isValidDate(item.data) &&
    typeof item.categoria === "string" &&
    (item.tipo === "receita" || item.tipo === "despesa")
  );
}
export function readTransactions(raw: string): Transacao[] {
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed) || !parsed.every(isTransacao))
    throw new Error("Registros inválidos");
  const ids = new Set<string>();
  for (const item of parsed) {
    if (ids.has(item.id)) throw new Error("Identificadores repetidos");
    ids.add(item.id);
  }
  return parsed.map((item) => ({
    ...item,
    valor: Math.round(item.valor * 100) / 100,
  }));
}

/** Migra a antiga demonstração sem remover registros adicionados pela pessoa. */
export function readPersonalTransactions(
  raw: string | null,
  legacyExampleMode = false,
): Transacao[] {
  if (raw === null) return [];
  const items = readTransactions(raw);
  return legacyExampleMode
    ? items.filter((item) => !/^demo-\d{4}-\d{2}-\d+$/.test(item.id))
    : items;
}
export function forMonth(
  items: readonly Transacao[],
  month: string,
): Transacao[] {
  return items.filter((item) => !month || item.data.startsWith(`${month}-`));
}
export function summarize(items: readonly Transacao[]) {
  const receitas = items
    .filter((item) => item.tipo === "receita")
    .reduce((sum, item) => sum + Math.round(item.valor * 100), 0);
  const despesas = items
    .filter((item) => item.tipo === "despesa")
    .reduce((sum, item) => sum + Math.round(item.valor * 100), 0);
  return {
    receitas: receitas / 100,
    despesas: despesas / 100,
    saldo: (receitas - despesas) / 100,
  };
}
export function recentTransactions(items: readonly Transacao[]): Transacao[] {
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => b.item.data.localeCompare(a.item.data) || b.index - a.index)
    .map(({ item }) => item);
}
export function monthLabel(month: string, short = false): string {
  if (!month) return "Todo o período";
  return new Date(`${month}-01T12:00:00`)
    .toLocaleDateString("pt-BR", {
      month: short ? "short" : "long",
      ...(short ? {} : { year: "numeric" }),
    })
    .replace(".", "");
}
export function monthSeries(
  items: readonly Transacao[],
  endMonth: string,
  length = 6,
) {
  const end = new Date(`${endMonth}-01T12:00:00`);
  return Array.from({ length }, (_, index) => {
    const date = new Date(
      end.getFullYear(),
      end.getMonth() - length + index + 1,
      1,
      12,
    );
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    return {
      month,
      label: monthLabel(month, true),
      ...summarize(forMonth(items, month)),
    };
  });
}
export function categoryTotals(items: readonly Transacao[]) {
  const totals = new Map<string, number>();
  items
    .filter((item) => item.tipo === "despesa")
    .forEach((item) =>
      totals.set(
        item.categoria,
        (totals.get(item.categoria) ?? 0) + Math.round(item.valor * 100),
      ),
    );
  return [...totals]
    .map(([categoria, cents]) => ({
      categoria,
      valor: cents / 100,
      color: categoryColors[categoria] ?? categoryColors.Outros!,
    }))
    .sort((a, b) => b.valor - a.valor);
}
export function toCsv(items: readonly Transacao[]): string {
  const cell = (value: string) =>
    `"${(/^[=+@\-\t\r]/.test(value) ? `'${value}` : value).replaceAll('"', '""')}"`;
  const rows = items.map((item) =>
    [
      item.nome,
      item.tipo === "receita" ? "Receita" : "Despesa",
      item.categoria,
      item.data,
      item.valor.toFixed(2).replace(".", ","),
    ]
      .map(cell)
      .join(";"),
  );
  return (
    "\uFEFF" + ["Nome;Tipo;Categoria;Data;Valor (R$)", ...rows].join("\r\n")
  );
}
