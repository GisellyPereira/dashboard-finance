import type { Transacao } from "~/utils/finance";
export const useTransactionEditor = () => {
  const open = useState("transaction-editor-open", () => false);
  const selected = useState<Transacao | null>(
    "transaction-editor-selected",
    () => null,
  );
  const action = useState<"edit" | "delete">(
    "transaction-editor-action",
    () => "edit",
  );
  const show = (item: Transacao | null = null) => {
    selected.value = item ? { ...item } : null;
    action.value = "edit";
    open.value = true;
  };
  const remove = (item: Transacao) => {
    selected.value = { ...item };
    action.value = "delete";
    open.value = true;
  };
  const close = () => {
    open.value = false;
  };
  return { open, selected, action, show, remove, close };
};
