export const useValuePrivacy = () => {
  const hidden = useState("finance-hidden-values", () => false);
  return {
    hidden,
    toggle: () => {
      hidden.value = !hidden.value;
    },
  };
};
