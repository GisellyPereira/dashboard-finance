export const useFinanceNotification = () => {
  const message = useState("finance-notice", () => ({ text: "", id: 0 }));
  const notify = (text: string) => {
    message.value = { text, id: message.value.id + 1 };
  };
  return { message, notify };
};
