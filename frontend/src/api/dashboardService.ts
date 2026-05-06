import { apiClient } from './client';
import type { ResumoDashboard } from '../types/api';

export const dashboardService = {
  async obterResumo(): Promise<ResumoDashboard> {
    const { data } = await apiClient.get<ResumoDashboard>('/api/dashboard/resumo');
    return data;
  },
};
