export const formatarData = (data: string): string => {
  return new Date(data).toLocaleDateString('pt-BR')
} 