import { apiClient } from './client';
import type { Pagina, ParametrosPaginacao, Venda, VendaFiltro, VendaRequest } from '../types/api';

const BASE = '/api/vendas';

export const vendaService = {
  async listar(filtro: VendaFiltro, paginacao: ParametrosPaginacao): Promise<Pagina<Venda>> {
    const { data } = await apiClient.get<Pagina<Venda>>(BASE, {
      params: { ...filtro, ...paginacao },
    });
    return data;
  },
  async cadastrar(payload: VendaRequest): Promise<Venda> {
    const { data } = await apiClient.post<Venda>(BASE, payload);
    return data;
  },
  async remover(id: number): Promise<void> {
    await apiClient.delete(`${BASE}/${id}`);
  },
};
