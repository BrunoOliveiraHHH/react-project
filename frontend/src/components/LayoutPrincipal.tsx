/**
 * LayoutPrincipal — esqueleto comum (header + sidebar + área de conteúdo).
 *
 * 📚 CONCEITO REACT: layout via `<Outlet />` do React Router — equivalente ao
 * `<router-view>` aninhado do Vue Router.
 *
 * 🔁 PARALELO COM VUE/QUASAR:
 *  - Em Quasar é o `q-layout` com `q-header` + `q-drawer` + `q-page-container`.
 *  - O `<Outlet />` é o `<router-view>` que renderiza a rota filha.
 */
import { AppShell, Burger, Group, NavLink, Title, Select, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  IconCategory,
  IconLayoutDashboard,
  IconLogout,
  IconPackage,
  IconShoppingCart,
  IconUsers,
} from '@tabler/icons-react';
import { useAutenticacao } from '../context/AuthContext';

export function LayoutPrincipal() {
  // useDisclosure do Mantine — hook utilitário para abrir/fechar drawer.
  // 🔁 Equivalente a `const aberto = ref(false)` em Vue.
  const [navAberta, { toggle: alternarNav }] = useDisclosure();
  const { t, i18n } = useTranslation();
  const navegar = useNavigate();
  const localizacao = useLocation();
  const { usuario, logout } = useAutenticacao();

  const itensMenu = [
    { rotulo: t('menu.dashboard'), rota: '/dashboard', icone: <IconLayoutDashboard size={18} /> },
    { rotulo: t('menu.categorias'), rota: '/categorias', icone: <IconCategory size={18} /> },
    { rotulo: t('menu.produtos'), rota: '/produtos', icone: <IconPackage size={18} /> },
    { rotulo: t('menu.clientes'), rota: '/clientes', icone: <IconUsers size={18} /> },
    { rotulo: t('menu.vendas'), rota: '/vendas', icone: <IconShoppingCart size={18} /> },
  ];

  const aoSair = () => {
    logout();
    navegar('/login');
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 240, breakpoint: 'sm', collapsed: { mobile: !navAberta } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={navAberta} onClick={alternarNav} hiddenFrom="sm" size="sm" />
            <Title order={4}>{t('app.title')}</Title>
          </Group>

          <Group>
            <Select
              size="xs"
              w={110}
              value={i18n.language}
              onChange={(valor) => valor && void i18n.changeLanguage(valor)}
              data={[
                { value: 'pt-BR', label: 'Português' },
                { value: 'en-US', label: 'English' },
              ]}
              aria-label="Idioma"
            />
            <Button
              variant="subtle"
              leftSection={<IconLogout size={16} />}
              onClick={aoSair}
              size="xs"
            >
              {usuario?.username} — {t('app.logout')}
            </Button>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        {itensMenu.map((item) => (
          <NavLink
            key={item.rota}
            label={item.rotulo}
            leftSection={item.icone}
            active={localizacao.pathname.startsWith(item.rota)}
            onClick={() => navegar(item.rota)}
          />
        ))}
      </AppShell.Navbar>

      <AppShell.Main>
        {/* Outlet — onde a rota filha é renderizada (≡ <router-view>). */}
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
