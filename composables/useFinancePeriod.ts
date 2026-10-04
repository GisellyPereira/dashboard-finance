import { hoje, monthLabel } from "~/utils/finance";
export const useFinancePeriod = () => {
  const selectedMonth = useState("finance-month", () => hoje().slice(0, 7));
  const { transacoes } = useTransacoes();
  const months = computed(() =>
    [
      ...new Set([
        hoje().slice(0, 7),
        ...transacoes.value.map((item) => item.data.slice(0, 7)),
      ]),
    ]
      .sort()
      .reverse(),
  );
  return {
    selectedMonth,
    months,
    label: computed(() => monthLabel(selectedMonth.value)),
  };
};
