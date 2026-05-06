/**
 * AuthContext — estado global de autenticação via Context API.
 *
 * 📚 CONCEITO REACT: Context API + custom hook (`useAutenticacao`) que abstrai
 * o `useContext`. É o mecanismo nativo do React para "prop drilling solving".
 *
 * 🎯 O QUE FAZ:
 *  - Mantém `usuario` (ou null) em memória + token em localStorage.
 *  - Expõe `login(...)` e `logout()` para o resto do app.
 *
 * 🔁 PARALELO COM VUE/QUASAR:
 *  - Em Vue 3, isso seria `provide('auth', ...)` no `App.vue` + `inject('auth')`
 *    nos descendentes — OU uma store Pinia (`useAuthStore`).
 *  - Em Quasar, normalmente um boot file injetando uma store.
 *  - O `AuthProvider` é o equivalente ao `<provide>`; o hook `useAutenticacao`
 *    é o equivalente ao `inject`.
 *
 * 💡 POR QUE CONTEXT API AQUI (e não Zustand):
 *  - Estado de autenticação é raramente atualizado e precisa estar disponível
 *    em qualquer profundidade da árvore. Context cabe perfeitamente, sem
 *    adicionar dependências.
 *  - Para UI mais dinâmica (modais, drawer, tema), usamos Zustand em outro local.
 *
 * 🌍 OUTROS CASOS DE USO PARA CONTEXT:
 *  - Tema (claro/escuro).
 *  - Idioma corrente.
 *  - Usuário logado (este caso).
 *  - Configurações globais raras de mudar.
 *
 * ⚠️ QUANDO NÃO USAR CONTEXT:
 *  - Estado que muda muito frequentemente — todos os consumidores re-renderizam.
 *    Para isso prefira Zustand/Redux/Jotai.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../api/authService';
import { limparToken, obterToken, salvarToken } from '../api/client';
import type { LoginRequest } from '../types/api';

interface UsuarioAutenticado {
  username: string;
  role: string;
}

interface AuthContextValor {
  usuario: UsuarioAutenticado | null;
  carregando: boolean;
  login: (credenciais: LoginRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValor | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider — componente que provê o contexto.
 * Use-o no topo da árvore (em `App.tsx`).
 */
export function AuthProvider({ children }: AuthProviderProps) {
  // useState — estado local. Equivalente Vue: `const usuario = ref<...>(null)`.
  const [usuario, setUsuario] = useState<UsuarioAutenticado | null>(null);
  const [carregando, setCarregando] = useState<boolean>(true);

  // useEffect — efeito colateral disparado após montagem.
  // Equivalente Vue: `onMounted(() => { ... })`.
  // O array vazio `[]` significa "rodar uma única vez".
  useEffect(() => {
    const token = obterToken();
    if (token) {
      // Token existe — assume sessão válida (em produção, validar via /me).
      const usernameSalvo = localStorage.getItem('erp.username') ?? '';
      const roleSalva = localStorage.getItem('erp.role') ?? '';
      if (usernameSalvo) setUsuario({ username: usernameSalvo, role: roleSalva });
    }
    setCarregando(false);
  }, []);

  // useCallback — memoiza a função para que sua referência não mude entre renders.
  // Equivalente Vue: as funções num `<script setup>` já têm referência estável,
  // mas em React precisamos do useCallback quando passamos a função em deps.
  const login = useCallback(async (credenciais: LoginRequest) => {
    const resposta = await authService.login(credenciais);
    salvarToken(resposta.token);
    localStorage.setItem('erp.username', resposta.username);
    localStorage.setItem('erp.role', resposta.role);
    setUsuario({ username: resposta.username, role: resposta.role });
  }, []);

  const logout = useCallback(() => {
    limparToken();
    localStorage.removeItem('erp.username');
    localStorage.removeItem('erp.role');
    setUsuario(null);
  }, []);

  // useMemo — memoiza o objeto do contexto. Sem isso, qualquer re-render do
  // Provider criaria um novo objeto e propagaria re-render para todos os
  // consumidores. Equivalente Vue: `computed(...)`.
  const valor = useMemo<AuthContextValor>(
    () => ({ usuario, carregando, login, logout }),
    [usuario, carregando, login, logout],
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook — abstrai o useContext + valida que está dentro do Provider.
 * 🔁 PARALELO Vue: composable `useAuth()` que retorna a store Pinia.
 */
export function useAutenticacao(): AuthContextValor {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAutenticacao deve ser usado dentro de <AuthProvider>');
  }
  return ctx;
}
