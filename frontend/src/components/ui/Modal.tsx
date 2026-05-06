/**
 * Modal — wrapper sobre o `<Modal>` do Mantine.
 *
 * 📚 CONCEITO REACT: composição via `children` (slot) + props.
 *
 * 🔁 PARALELO COM VUE/QUASAR:
 *  - Em Quasar você usaria `<q-dialog>`. Aqui criamos uma camada própria
 *    (`Modal`) para padronizar visual/header/footer e poder trocar a base no
 *    futuro sem refatorar todos os modais do app.
 *  - `children` ⇄ `<slot>` (default).
 *  - `footer` é um slot nomeado — em Vue você usaria `<template #footer>`.
 *  - O Modal é renderizado num portal — paralelo ao `<Teleport to="body">` do Vue.
 *
 * 💡 POR QUE WRAPPER:
 *  - Centralizar tamanho padrão, tradução do botão fechar, espaçamento.
 *  - Se um dia trocar Mantine por shadcn/ui, só este arquivo muda.
 *
 * 🌍 OUTROS CASOS DE USO PARA ESTE PADRÃO:
 *  - Sempre que a UI usa um componente de biblioteca em DEZENAS de lugares.
 *    Criar um wrapper interno é a forma de proteger sua app de mudanças
 *    de API da lib externa.
 */
import type { ReactNode } from 'react';
import { Modal as MantineModal, Group, Stack } from '@mantine/core';

export interface ModalProps {
  /** Controla a visibilidade — paralelo ao `v-model` do `<q-dialog>`. */
  aberto: boolean;
  /** Callback de fechamento. */
  aoFechar: () => void;
  /** Título exibido no cabeçalho. */
  titulo: ReactNode;
  /** Conteúdo principal — slot default. */
  children: ReactNode;
  /** Slot do rodapé (geralmente botões). */
  rodape?: ReactNode;
  /** Tamanho do modal. Padrão: "md". */
  tamanho?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ aberto, aoFechar, titulo, children, rodape, tamanho = 'md' }: ModalProps) {
  return (
    <MantineModal
      opened={aberto}
      onClose={aoFechar}
      title={titulo}
      size={tamanho}
      centered
      closeButtonProps={{ 'aria-label': 'Fechar' }}
    >
      <Stack gap="md">
        {children}
        {rodape && (
          <Group justify="flex-end" mt="sm">
            {rodape}
          </Group>
        )}
      </Stack>
    </MantineModal>
  );
}
