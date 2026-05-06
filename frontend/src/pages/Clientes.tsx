/**
 * Clientes.tsx — Listagem paginada com filtros + CRUD.
 */
import { ActionIcon, Button, Group, Stack, TextInput } from '@mantine/core';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import { PageHeader } from '../components/ui/PageHeader';
import { DataTable } from '../components/ui/DataTable';
import type { ColunaTabela } from '../components/ui/DataTable';
import { ClienteFormModal } from '../components/modals/ClienteFormModal';
import { ConfirmacaoRemocaoModal } from '../components/modals/ConfirmacaoRemocaoModal';
import { useAberturaModal } from '../hooks/useAberturaModal';
import { useListagemPaginada } from '../hooks/useListagemPaginada';
import { useCrudMutation } from '../hooks/useCrudMutations';
import { clienteService } from '../api/clienteService';
import { queryKeys } from '../lib/queryKeys';
import type { Cliente, ClienteFiltro } from '../types/api';

const FILTRO_INICIAL: ClienteFiltro = {};

export default function Clientes() {
  const { t } = useTranslation();

  const listagem = useListagemPaginada<ClienteFiltro, Cliente>({
    queryKey: queryKeys.clientes.lista,
    buscar: clienteService.listar,
    sort: 'nome,asc',
    filtroInicial: FILTRO_INICIAL,
  });

  const modalForm = useAberturaModal<Cliente>();
  const modalRemocao = useAberturaModal<Cliente>();

  const remover = useCrudMutation({
    acao: (id: number) => clienteService.remover(id),
    invalidar: [queryKeys.clientes.all],
    mensagemSucesso: 'Removido!',
    aoSucesso: modalRemocao.fechar,
  });

  const colunas: ColunaTabela<Cliente>[] = [
    { id: 'nome', rotulo: t('campos.nome'), chave: 'nome' },
    { id: 'cpf', rotulo: t('campos.cpf'), chave: 'cpf' },
    { id: 'email', rotulo: t('campos.email'), chave: 'email' },
    { id: 'telefone', rotulo: t('campos.telefone'), chave: 'telefone' },
    {
      id: 'acoes',
      rotulo: t('comum.acoes'),
      largura: 120,
      renderizar: (item) => (
        <Group gap="xs">
          <ActionIcon variant="light" onClick={() => modalForm.abrir(item)}>
            <IconEdit size={16} />
          </ActionIcon>
          <ActionIcon variant="light" color="red" onClick={() => modalRemocao.abrir(item)}>
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      ),
    },
  ];

  return (
    <Stack>
      <PageHeader
        titulo={t('menu.clientes')}
        acoes={
          <Button leftSection={<IconPlus size={16} />} onClick={() => modalForm.abrir()}>
            {t('comum.novo')}
          </Button>
        }
      />

      <Group align="flex-end" wrap="wrap">
        <TextInput
          label={t('campos.nome')}
          value={listagem.filtroPendente.nome ?? ''}
          onChange={(e) =>
            listagem.setFiltroPendente((f) => ({ ...f, nome: e.currentTarget.value }))
          }
        />
        <TextInput
          label={t('campos.cpf')}
          value={listagem.filtroPendente.cpf ?? ''}
          onChange={(e) =>
            listagem.setFiltroPendente((f) => ({ ...f, cpf: e.currentTarget.value }))
          }
        />
        <TextInput
          label={t('campos.email')}
          value={listagem.filtroPendente.email ?? ''}
          onChange={(e) =>
            listagem.setFiltroPendente((f) => ({ ...f, email: e.currentTarget.value }))
          }
        />
        <Button onClick={listagem.aplicarFiltros}>{t('comum.filtrar')}</Button>
        <Button variant="default" onClick={listagem.limparFiltros}>
          {t('comum.limpar')}
        </Button>
      </Group>

      <DataTable<Cliente>
        carregando={listagem.carregando}
        dados={listagem.dados?.conteudo ?? []}
        obterId={(c) => c.id}
        paginaAtual={listagem.dados?.pagina}
        totalPaginas={listagem.dados?.totalPaginas}
        aoMudarPagina={listagem.setPagina}
        colunas={colunas}
      />

      <ClienteFormModal
        aberto={modalForm.aberto}
        aoFechar={modalForm.fechar}
        cliente={modalForm.dados}
      />
      <ConfirmacaoRemocaoModal
        aberto={modalRemocao.aberto}
        aoFechar={modalRemocao.fechar}
        carregando={remover.isPending}
        aoConfirmar={() => modalRemocao.dados && remover.mutate(modalRemocao.dados.id)}
      />
    </Stack>
  );
}
