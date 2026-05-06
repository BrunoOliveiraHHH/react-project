/**
 * PrivateRoute — guarda de rota.
 *
 * 📚 CONCEITO REACT: composição via `children`. Recebe um componente filho e
 * decide se renderiza-o ou redireciona para /login.
 *
 * 🔁 PARALELO COM VUE/QUASAR:
 *  - Equivalente a um `router.beforeEach((to) => { if (!auth) return '/login' })`.
 *  - Em Vue, normalmente fica em `router/index.ts`. Em React, modela-se como
 *    um componente que envolve a rota.
 *
 * 💡 POR QUE COMPONENTE (e não config):
 *  - O React Router não tem hook global `beforeEach`. O padrão idiomático é
 *    expressar a guarda como JSX.
 */
import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAutenticacao } from '../context/AuthContext';
import { Center, Loader } from '@mantine/core';

interface PrivateRouteProps {
  children: ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { usuario, carregando } = useAutenticacao();
  const localizacao = useLocation();

  if (carregando) {
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    );
  }

  if (!usuario) {
    // `state` permite voltar para a página original após login.
    return <Navigate to="/login" state={{ de: localizacao.pathname }} replace />;
  }

  return <>{children}</>;
}
