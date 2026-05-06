import { apiClient } from './client';
import type { LoginRequest, LoginResponse } from '../types/api';

/**
 * authService — encapsula chamadas HTTP de autenticação.
 *
 * 🔁 PARALELO COM VUE/QUASAR:
 *  - Equivalente a um composable `useAuthService.ts` que retorna métodos.
 *
 * 💡 POR QUE SEPARAR EM SERVICE:
 *  - Mantém componentes burros: a página `Login.tsx` só sabe chamar
 *    `authService.login(...)` — não conhece `axios`, headers, paths.
 */
export const authService = {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>('/api/auth/login', payload);
    return data;
  },
};
