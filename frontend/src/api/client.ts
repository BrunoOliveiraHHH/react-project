/**
 * Instância axios única, com interceptors:
 *   - Request: anexa "Authorization: Bearer <token>" se houver token salvo.
 *   - Response: em 401 limpa o token e redireciona para /login.
 *
 * 🔁 PARALELO COM VUE/QUASAR:
 *  - Em Quasar é comum criar um boot file (`src/boot/axios.ts`) com a mesma ideia.
 *
 * 💡 POR QUE AXIOS (em vez de fetch nativo):
 *  - Interceptors prontos, transform de erros, timeouts, abort.
 *  - O custo em bundle (~13kb gz) compensa a clareza do código em apps reais.
 *
 * 🌍 OUTROS CASOS DE USO:
 *  - Qualquer SPA que consuma APIs autenticadas. Em projetos só com endpoints
 *    triviais (GET público), `fetch` puro pode bastar.
 */
import axios, { AxiosError } from 'axios';

const URL_API = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';
const CHAVE_TOKEN = 'erp.token';

export const apiClient = axios.create({
  baseURL: URL_API,
  timeout: 15_000,
});

// Helpers de token (deliberadamente simples — em produção, considere cookies httpOnly).
export const obterToken = (): string | null => localStorage.getItem(CHAVE_TOKEN);
export const salvarToken = (token: string): void => localStorage.setItem(CHAVE_TOKEN, token);
export const limparToken = (): void => localStorage.removeItem(CHAVE_TOKEN);

// Interceptor de REQUEST — injeta Bearer.
apiClient.interceptors.request.use((config) => {
  const token = obterToken();
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

// Interceptor de RESPONSE — em 401, encerra sessão.
apiClient.interceptors.response.use(
  (response) => response,
  (erro: AxiosError) => {
    if (erro.response?.status === 401) {
      limparToken();
      // Evita loop quando já estamos na rota /login.
      if (!window.location.pathname.startsWith('/login')) {
        window.location.assign('/login');
      }
    }
    return Promise.reject(erro);
  },
);
