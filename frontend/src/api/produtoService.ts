import { apiClient } from './client';
import type {
  Pagina,
  ParametrosPaginacao,
  Produto,
  ProdutoFiltro,
  ProdutoRequest,
} from '../types/api';

const BASE = '/api/produtos';

export const produtoService = {
  async listar(filtro: ProdutoFiltro, paginacao: ParametrosPaginacao): Promise<Pagina<Produto>> {
    const { data } = await apiClient.get<Pagina<Produto>>(BASE, {
      params: { ...filtro, ...paginacao },
    });
    return data;
  },
  async cadastrar(payload: ProdutoRequest): Promise<Produto> {
    const { data } = await apiClient.post<Produto>(BASE, payload);
    return data;
  },
  async atualizar(id: number, payload: ProdutoRequest): Promise<Produto> {
    const { data } = await apiClient.put<Produto>(`${BASE}/${id}`, payload);
    return data;
  },
  async remover(id: number): Promise<void> {
    await apiClient.delete(`${BASE}/${id}`);
  },
};
