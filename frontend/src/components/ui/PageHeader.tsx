/**
 * PageHeader — título da página + ações à direita.
 *
 * 📚 CONCEITO REACT: composição com `children` para slot de ações.
 * 🔁 PARALELO Vue/Quasar: equivalente a um `<q-toolbar>` próprio com `<slot>`.
 */
import { Group, Title } from '@mantine/core';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  titulo: string;
  acoes?: ReactNode;
}

export function PageHeader({ titulo, acoes }: PageHeaderProps) {
  return (
    <Group justify="space-between" mb="md">
      <Title order={2}>{titulo}</Title>
      {acoes && <Group gap="sm">{acoes}</Group>}
    </Group>
  );
}
