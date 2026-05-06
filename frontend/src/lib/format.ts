/**
 * Formatters compartilhados (singleton para evitar re-criação em cada render).
 *
 * 💡 NÍVEL SÊNIOR: criar `Intl.NumberFormat` dentro de componentes é uma
 * micro-otimização que vale para tabelas grandes — Intl é caro de instanciar.
 */
export const formatadores = {
  moeda: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }),
  inteiro: new Intl.NumberFormat('pt-BR'),
  dataHora: new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
  data: new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }),
} as const;

export const formatarMoeda = (valor: number | null | undefined): string =>
  formatadores.moeda.format(valor ?? 0);

export const formatarDataHora = (iso: string | null | undefined): string =>
  iso ? formatadores.dataHora.format(new Date(iso)) : '';
