import test from "node:test";
import assert from "node:assert/strict";
import {
  summarize,
  monthSeries,
  forMonth,
  categoryTotals,
  readTransactions,
  readPersonalTransactions,
  toCsv,
  isValidDate,
  recentTransactions,
  type Transacao,
} from "../utils/finance.ts";
const tx = (dados: Partial<Transacao>): Transacao => ({
  id: "1",
  nome: "Exemplo",
  valor: 1,
  data: "2026-01-10",
  categoria: "Outros",
  tipo: "receita",
  ...dados,
});

test("totais financeiros usam centavos e distinguem entradas de saídas", () => {
  assert.deepEqual(
    summarize([
      tx({ valor: 0.1 }),
      tx({ id: "2", valor: 0.2 }),
      tx({ id: "3", valor: 0.15, tipo: "despesa" }),
    ]),
    { receitas: 0.3, despesas: 0.15, saldo: 0.15 },
  );
});
test("a série mensal cruza o ano em ordem e mantém os meses sem registros", () => {
  const dados = [
    tx({ valor: 50, data: "2025-12-30" }),
    tx({ id: "2", valor: 20, data: "2026-01-02", tipo: "despesa" }),
  ];
  const series = monthSeries(dados, "2026-02", 4);
  assert.deepEqual(
    series.map((item) => item.month),
    ["2025-11", "2025-12", "2026-01", "2026-02"],
  );
  assert.deepEqual(
    series.map((item) => item.saldo),
    [0, 50, -20, 0],
  );
  assert.equal(forMonth(dados, "2026-01").length, 1);
});
test("datas impossíveis são recusadas, incluindo fevereiro de ano não bissexto", () => {
  assert.equal(isValidDate("2026-02-29"), false);
  assert.equal(isValidDate("2024-02-29"), true);
  assert.equal(isValidDate("2026-04-31"), false);
});
test("registros antigos válidos são mantidos e dados corrompidos não são aceitos", () => {
  const dados = [
    tx({ id: "123456", categoria: "Categoria antiga", valor: 25.25 }),
  ];
  assert.deepEqual(readTransactions(JSON.stringify(dados)), dados);
  assert.throws(() => readTransactions("{corrompido"));
  assert.throws(() => readTransactions(JSON.stringify([tx({ valor: -3 })])));
  assert.throws(() => readTransactions(JSON.stringify([tx({}), tx({})])));
});
test("categorias somam apenas despesas, ordenadas por valor", () => {
  const totals = categoryTotals([
    tx({ tipo: "despesa", categoria: "Moradia", valor: 900 }),
    tx({ id: "2", tipo: "despesa", categoria: "Moradia", valor: 100 }),
    tx({ id: "3", tipo: "despesa", categoria: "Lazer", valor: 30 }),
    tx({ id: "4", valor: 5000 }),
  ]);
  assert.deepEqual(
    totals.map((item) => [item.categoria, item.valor]),
    [
      ["Moradia", 1000],
      ["Lazer", 30],
    ],
  );
});
test("exportação CSV preserva vírgulas e aspas e neutraliza fórmulas em descrições", () => {
  const csv = toCsv([
    tx({ nome: "=SUM(1;2)", valor: 42.5 }),
    tx({ id: "2", nome: 'Compra "especial"' }),
  ]);
  assert.ok(csv.includes('"\'=SUM(1;2)"'));
  assert.ok(csv.includes('"42,50"'));
  assert.ok(csv.includes('"Compra ""especial"""'));
});
test("registros recentes usam a data real e não a ordem de inserção", () => {
  const list = [
    tx({ id: "1", data: "2026-01-02" }),
    tx({ id: "2", data: "2026-01-25" }),
  ];
  assert.deepEqual(
    recentTransactions(list).map((item) => item.id),
    ["2", "1"],
  );
  assert.equal(list[0]?.id, "1");
  assert.deepEqual(
    recentTransactions([tx({ id: "demo" }), tx({ id: "a-new-uuid" })]).map(
      (item) => item.id,
    ),
    ["a-new-uuid", "demo"],
  );
});

test("a versão real começa vazia e migra somente os dados da antiga demonstração", () => {
  assert.deepEqual(readPersonalTransactions(null), []);
  const real = tx({ id: "personal-uuid", nome: "Minha receita", valor: 250 });
  const example = tx({ id: "demo-2026-10-40", nome: "Salário", valor: 6200 });
  const raw = JSON.stringify([example, real]);
  assert.deepEqual(readPersonalTransactions(raw, true), [real]);
  assert.deepEqual(readPersonalTransactions(raw, false), [example, real]);
});
