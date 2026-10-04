export const formatarData = (data: string) =>
  new Date(`${data}T12:00:00`).toLocaleDateString("pt-BR");
