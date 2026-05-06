/**
 * useListagemPaginada — hook genérico que encapsula o ciclo de uma listagem:
 *   - estado de filtro pendente (form) e filtro aplicado (query)
 *   - estado de página (0-based)
 *   - useQuery com queryKey gerada
 *   - ações: aplicarFiltros / limparFiltros / mudarPagina
 *
 * 🎯 PROBLEMA QUE RESOLVE:
 *   Cada página repetia ~30 linhas idênticas de useState + useQuery + handlers.
 *   Refatorações (ex.: trocar size, adicionar URL sync) precisavam ser feitas
 *   N vezes.
 *
 * 💡 NÍVEL SÊNIOR:
 *   - Tipagem genérica preserva o tipo do filtro e do conteúdo da página.
 *   - keepPreviousData/placeholderData evita "piscar" enquanto refetcha.
 *   - Separação clara entre `filtroPendente` (form) e `filtro` (committed),
 *     permitindo "Filtrar"/"Limpar" sem refetch a cada tecla.
 *
 * @typeParam TFiltro  Shape do objeto de filtro.
 * @typeParam TItem    Tipo dos itens da página.
 */
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import type { Pagina, ParametrosPaginacao } from '../types/api';

interface OpcoesUseListagem<TFiltro, TItem> {
  /** Chave de cache (use a query key factory). */
  queryKey: (filtro: TFiltro, paginacao: ParametrosPaginacao) => readonly unknown[];
  /** Função de fetch. */
  buscar: (filtro: TFiltro, paginacao: ParametrosPaginacao) => Promise<Pagina<TItem>>;
  /** Tamanho da página. */
  tamanho?: number;
  /** Sort padrão (formato Spring: `campo,asc|desc`). */
  sort?: string;
  /** Filtro inicial. */
  filtroInicial: TFiltro;
}

interface RetornoUseListagem<TFiltro, TItem> {
  filtroPendente: TFiltro;
  setFiltroPendente: React.Dispatch<React.SetStateAction<TFiltro>>;
  filtroAplicado: TFiltro;
  pagina: number;
  setPagina: (n: number) => void;
  dados: Pagina<TItem> | undefined;
  carregando: boolean;
  buscando: boolean;
  aplicarFiltros: () => void;
  limparFiltros: () => void;
}

export function useListagemPaginada<TFiltro extends object, TItem>(
  opcoes: OpcoesUseListagem<TFiltro, TItem>,
): RetornoUseListagem<TFiltro, TItem> {
  const { queryKey, buscar, tamanho = 10, sort, filtroInicial } = opcoes;

  const [filtroPendente, setFiltroPendente] = useState<TFiltro>(filtroInicial);
  const [filtroAplicado, setFiltroAplicado] = useState<TFiltro>(filtroInicial);
  const [pagina, setPagina] = useState(0);

  const paginacao: ParametrosPaginacao = { page: pagina, size: tamanho, sort };

  const consulta = useQuery({
    queryKey: queryKey(filtroAplicado, paginacao),
    queryFn: () => buscar(filtroAplicado, paginacao),
    placeholderData: keepPreviousData, // evita flicker entre páginas
  });

  const aplicarFiltros = useCallback(() => {
    setPagina(0);
    setFiltroAplicado(filtroPendente);
  }, [filtroPendente]);

  const limparFiltros = useCallback(() => {
    setFiltroPendente(filtroInicial);
    setFiltroAplicado(filtroInicial);
    setPagina(0);
  }, [filtroInicial]);

  return {
    filtroPendente,
    setFiltroPendente,
    filtroAplicado,
    pagina,
    setPagina,
    dados: consulta.data,
    carregando: consulta.isLoading,
    buscando: consulta.isFetching,
    aplicarFiltros,
    limparFiltros,
  };
}
