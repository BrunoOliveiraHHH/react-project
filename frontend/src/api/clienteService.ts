import { apiClient } from './client';
import type {
  Cliente,
  ClienteFiltro,
  ClienteRequest,
  Pagina,
  ParametrosPaginacao,
} from '../types/api';

const BASE = '/api/clientes';

export const clienteService = {
  async listar(filtro: ClienteFiltro, paginacao: ParametrosPaginacao): Promise<Pagina<Cliente>> {
    const { data } = await apiClient.get<Pagina<Cliente>>(BASE, {
      params: { ...filtro, ...paginacao },
    });
    return data;
  },
  async listarTodos(): Promise<Cliente[]> {
    const { data } = await apiClient.get<Cliente[]>(`${BASE}/todos`);
    return data;
  },
  async cadastrar(payload: ClienteRequest): Promise<Cliente> {
    const { data } = await apiClient.post<Cliente>(BASE, payload);
    return data;
  },
  async atualizar(id: number, payload: ClienteRequest): Promise<Cliente> {
    const { data } = await apiClient.put<Cliente>(`${BASE}/${id}`, payload);
    return data;
  },
  async remover(id: number): Promise<void> {
    await apiClient.delete(`${BASE}/${id}`);
  },
};
