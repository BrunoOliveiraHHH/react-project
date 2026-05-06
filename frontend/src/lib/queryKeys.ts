/**
 * Query Key Factory — padrão recomendado pelo time do TanStack Query.
 *
 * 🎯 PROBLEMA QUE RESOLVE:
 *   - Strings de queryKey espalhadas (`['produtos', filtro, pagina]`) viram
 *     fonte de bugs: typo em uma página invalida a query errada.
 *   - Refatorar a forma da chave exige caçar todos os usos.
 *
 * 💡 SOLUÇÃO:
 *   - Cada feature expõe um objeto com funções que devolvem a chave.
 *   - Hierarquia: `categorias.all` invalida tudo da feature; `categorias.lista(filtro)`
 *     invalida apenas listagens; `categorias.todas()` é cache separado.
 *
 * ✅ NÍVEL SÊNIOR: type-safety + invariância das chaves + invalidação granular.
 */
import type {
  CategoriaFiltro,
  ClienteFiltro,
  ParametrosPaginacao,
  ProdutoFiltro,
  VendaFiltro,
} from '../types/api';

export const queryKeys = {
  categorias: {
    all: ['categorias'] as const,
    lista: (filtro: CategoriaFiltro, paginacao: ParametrosPaginacao) =>
      [...queryKeys.categorias.all, 'lista', filtro, paginacao] as const,
    todas: () => [...queryKeys.categorias.all, 'todas'] as const,
  },
  produtos: {
    all: ['produtos'] as const,
    lista: (filtro: ProdutoFiltro, paginacao: ParametrosPaginacao) =>
      [...queryKeys.produtos.all, 'lista', filtro, paginacao] as const,
    busca: (termo: string) => [...queryKeys.produtos.all, 'busca', termo] as const,
  },
  clientes: {
    all: ['clientes'] as const,
    lista: (filtro: ClienteFiltro, paginacao: ParametrosPaginacao) =>
      [...queryKeys.clientes.all, 'lista', filtro, paginacao] as const,
    todos: () => [...queryKeys.clientes.all, 'todos'] as const,
  },
  vendas: {
    all: ['vendas'] as const,
    lista: (filtro: VendaFiltro, paginacao: ParametrosPaginacao) =>
      [...queryKeys.vendas.all, 'lista', filtro, paginacao] as const,
  },
  dashboard: {
    resumo: () => ['dashboard', 'resumo'] as const,
  },
} as const;
