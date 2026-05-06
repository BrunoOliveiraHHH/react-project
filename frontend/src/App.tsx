/**
 * App.tsx — Componente raiz da aplicação.
 *
 * 📚 CONCEITO REACT: composição de Providers + roteamento (React Router v7).
 *
 * 🔁 PARALELO COM VUE/QUASAR:
 *  - O encadeamento de Providers (`<MantineProvider>` ⊂ `<QueryClientProvider>` ⊂
 *    `<AuthProvider>` ⊂ `<BrowserRouter>`) é o equivalente a registrar plugins
 *    em Vue: `app.use(Quasar).use(router).use(pinia).use(i18n)`.
 *  - `<Routes>` ⇄ `<router-view>` + definições do `routes.ts` em Quasar.
 *  - `<Navigate to="/login">` ⇄ `router.push('/login')`.
 *
 * 💡 POR QUE TANSTACK QUERY (React Query):
 *  - Cache, retry, invalidation, loading/error automáticos para chamadas HTTP.
 *  - Substitui boilerplate de `useEffect + useState + try/catch + abort`.
 *  - 🔁 Em Vue, é equivalente ao @tanstack/vue-query — mesma autoria.
 *
 * 🌍 OUTROS CASOS DE USO PARA REACT QUERY:
 *  - Qualquer SPA com 2+ telas que consumam a mesma API. Para projetos
 *    pequenos/locais, useState + fetch também atende.
 */
import { Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { MantineProvider, Loader, Center } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider } from './context/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LayoutPrincipal } from './components/LayoutPrincipal';

// React.lazy + Suspense — code-splitting por rota.
// 🔁 Equivalente Vue: `defineAsyncComponent(() => import('./Page.vue'))`.
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Categorias = lazy(() => import('./pages/Categorias'));
const Produtos = lazy(() => import('./pages/Produtos'));
const Clientes = lazy(() => import('./pages/Clientes'));
const Vendas = lazy(() => import('./pages/Vendas'));

// Uma única instância do QueryClient para toda a aplicação.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000, // dados são considerados frescos por 30s
      refetchOnWindowFocus: false,
    },
  },
});

const indicadorCarregando = (
  <Center h="100vh">
    <Loader />
  </Center>
);

export default function App() {
  return (
    <ErrorBoundary>
      <MantineProvider defaultColorScheme="light">
        <Notifications position="top-right" />
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AuthProvider>
              <Suspense fallback={indicadorCarregando}>
                <Routes>
                  {/* Rota pública */}
                  <Route path="/login" element={<Login />} />

                  {/* Rotas protegidas — exigem JWT */}
                  <Route
                    element={
                      <PrivateRoute>
                        <LayoutPrincipal />
                      </PrivateRoute>
                    }
                  >
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/categorias" element={<Categorias />} />
                    <Route path="/produtos" element={<Produtos />} />
                    <Route path="/clientes" element={<Clientes />} />
                    <Route path="/vendas" element={<Vendas />} />
                  </Route>

                  {/* Catch-all */}
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Suspense>
            </AuthProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </MantineProvider>
    </ErrorBoundary>
  );
}
