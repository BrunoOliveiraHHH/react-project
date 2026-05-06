/**
 * Login.tsx — Página de autenticação.
 *
 * 📚 CONCEITOS DEMONSTRADOS:
 *  - useState (form controlado)
 *  - eventos sintéticos (onSubmit, onChange)
 *  - useNavigate (programmatic navigation)
 *  - i18n (tradução via useTranslation)
 *
 * 🔁 PARALELO COM VUE/QUASAR:
 *  - useState ⇄ ref()
 *  - onSubmit no form ⇄ @submit.prevent
 *  - useNavigate('/x') ⇄ router.push('/x')
 *  - useTranslation().t('chave') ⇄ $t('chave')
 *
 * 💡 POR QUE FORMULÁRIO COM useState (e não react-hook-form aqui):
 *  - É um form de 2 campos. O overhead de RHF + zod não compensa.
 *  - É didático mostrar o jeito "puro" do React para este caso simples,
 *    em contraste com os modais (que usam RHF).
 */
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Alert, Button, Card, Center, PasswordInput, Stack, TextInput, Title } from '@mantine/core';
import { useAutenticacao } from '../context/AuthContext';

interface EstadoLocalizacao {
  de?: string;
}

export default function Login() {
  // useState — estado local, dois pares (valor + setter).
  // 🔁 Vue: const username = ref(''); const senha = ref('');
  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const { t } = useTranslation();
  const { login } = useAutenticacao();
  const navegar = useNavigate();
  const localizacao = useLocation();
  const destino = (localizacao.state as EstadoLocalizacao | null)?.de ?? '/dashboard';

  /**
   * aoSubmeter — handler de submit. `e.preventDefault()` evita o reload da página.
   * 🔁 Vue: `<q-form @submit.prevent="aoSubmeter">` já evita o default.
   */
  const aoSubmeter = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErro(null);
    setEnviando(true);
    try {
      await login({ username, senha });
      navegar(destino, { replace: true });
    } catch {
      setErro(t('auth.login.erro'));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Center h="100vh">
      <Card shadow="sm" padding="xl" w={380} withBorder>
        <Title order={3} mb="md">
          {t('auth.login.title')}
        </Title>

        {/* form HTML — onSubmit dispara aoSubmeter. */}
        <form onSubmit={aoSubmeter}>
          <Stack>
            {/*
              Input "controlado": `value` vem do state, `onChange` atualiza o state.
              🔁 Vue: <q-input v-model="username" />
            */}
            <TextInput
              label={t('auth.login.username')}
              value={username}
              onChange={(e) => setUsername(e.currentTarget.value)}
              required
              autoFocus
              autoComplete="username"
            />
            <PasswordInput
              label={t('auth.login.senha')}
              value={senha}
              onChange={(e) => setSenha(e.currentTarget.value)}
              required
              autoComplete="current-password"
            />

            {/* Renderização condicional: só mostra Alert se houver erro. */}
            {/* 🔁 Vue: <q-banner v-if="erro">{{ erro }}</q-banner> */}
            {erro && <Alert color="red">{erro}</Alert>}

            <Button type="submit" loading={enviando} fullWidth>
              {t('auth.login.entrar')}
            </Button>
          </Stack>
        </form>
      </Card>
    </Center>
  );
}
