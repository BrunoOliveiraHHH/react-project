/**
 * ErrorBoundary — captura erros de renderização em qualquer descendente.
 *
 * 📚 CONCEITO REACT: Error Boundaries são, até hoje, um dos POUCOS casos onde
 * componentes de classe são obrigatórios (não há hook equivalente em React 19).
 *
 * 🔁 PARALELO COM VUE/QUASAR:
 *  - Em Vue, equivale ao hook `errorCaptured(err, instance, info)` no componente
 *    raiz, ou ao app-level `app.config.errorHandler`.
 *
 * 💡 QUANDO USAR:
 *  - Sempre, no nível do App, para evitar tela branca em produção.
 *  - Localmente, ao redor de seções "arriscadas" (ex.: gráficos com bibliotecas
 *    instáveis) para isolar falhas.
 */
import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Alert, Button, Stack } from '@mantine/core';

interface Props {
  children: ReactNode;
}

interface State {
  erro: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { erro: null };

  static getDerivedStateFromError(erro: Error): State {
    return { erro };
  }

  componentDidCatch(erro: Error, info: ErrorInfo): void {
    // Em produção, mande para Sentry/Datadog.
    console.error('ErrorBoundary capturou:', erro, info);
  }

  private recarregar = () => {
    this.setState({ erro: null });
    window.location.reload();
  };

  render() {
    if (this.state.erro) {
      return (
        <Stack p="xl">
          <Alert color="red" title="Algo deu errado">
            {this.state.erro.message}
          </Alert>
          <Button onClick={this.recarregar}>Recarregar</Button>
        </Stack>
      );
    }
    return this.props.children;
  }
}
