import { apiClient } from './client';
import type {
  Categoria,
  CategoriaFiltro,
  CategoriaRequest,
  Pagina,
  ParametrosPaginacao,
} from '../types/api';

const BASE = '/api/categorias';

export const categoriaService = {
  async listar(
    filtro: CategoriaFiltro,
    paginacao: ParametrosPaginacao,
  ): Promise<Pagina<Categoria>> {
    const { data } = await apiClient.get<Pagina<Categoria>>(BASE, {
      params: { ...filtro, ...paginacao },
    });
    return data;
  },

  async listarTodas(): Promise<Categoria[]> {
    const { data } = await apiClient.get<Categoria[]>(`${BASE}/todas`);
    return data;
  },

  async cadastrar(payload: CategoriaRequest): Promise<Categoria> {
    const { data } = await apiClient.post<Categoria>(BASE, payload);
    return data;
  },

  async atualizar(id: number, payload: CategoriaRequest): Promise<Categoria> {
    const { data } = await apiClient.put<Categoria>(`${BASE}/${id}`, payload);
    return data;
  },

  async remover(id: number): Promise<void> {
    await apiClient.delete(`${BASE}/${id}`);
  },
};
