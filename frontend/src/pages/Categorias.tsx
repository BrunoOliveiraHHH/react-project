/**
 * Categorias.tsx — Listagem paginada com filtros + CRUD.
 *
 * ✅ NÍVEL SÊNIOR:
 *   - Lógica repetida extraída em {@link useListagemPaginada} e {@link useCrudMutation}.
 *   - Query keys via factory ({@link queryKeys.categorias}) — sem strings soltas.
 *   - DataTable com colunas type-safe (chave: keyof Categoria).
 */
import { ActionIcon, Button, Group, Stack, TextInput } from '@mantine/core';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import { PageHeader } from '../components/ui/PageHeader';
import { DataTable } from '../components/ui/DataTable';
import type { ColunaTabela } from '../components/ui/DataTable';
import { CategoriaFormModal } from '../components/modals/CategoriaFormModal';
import { ConfirmacaoRemocaoModal } from '../components/modals/ConfirmacaoRemocaoModal';
import { useAberturaModal } from '../hooks/useAberturaModal';
import { useListagemPaginada } from '../hooks/useListagemPaginada';
import { useCrudMutation } from '../hooks/useCrudMutations';
import { categoriaService } from '../api/categoriaService';
import { queryKeys } from '../lib/queryKeys';
import type { Categoria, CategoriaFiltro } from '../types/api';

const FILTRO_INICIAL: CategoriaFiltro = {};

export default function Categorias() {
  const { t } = useTranslation();

  const listagem = useListagemPaginada<CategoriaFiltro, Categoria>({
    queryKey: queryKeys.categorias.lista,
    buscar: categoriaService.listar,
    sort: 'nome,asc',
    filtroInicial: FILTRO_INICIAL,
  });

  const modalForm = useAberturaModal<Categoria>();
  const modalRemocao = useAberturaModal<Categoria>();

  const remover = useCrudMutation({
    acao: (id: number) => categoriaService.remover(id),
    invalidar: [queryKeys.categorias.all],
    mensagemSucesso: 'Removido!',
    aoSucesso: modalRemocao.fechar,
  });

  const colunas: ColunaTabela<Categoria>[] = [
    { id: 'nome', rotulo: t('campos.nome'), chave: 'nome' },
    { id: 'descricao', rotulo: t('campos.descricao'), chave: 'descricao' },
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
        titulo={t('menu.categorias')}
        acoes={
          <Button leftSection={<IconPlus size={16} />} onClick={() => modalForm.abrir()}>
            {t('comum.novo')}
          </Button>
        }
      />

      <Group align="flex-end">
        <TextInput
          label={t('campos.nome')}
          value={listagem.filtroPendente.nome ?? ''}
          onChange={(e) =>
            listagem.setFiltroPendente((f) => ({ ...f, nome: e.currentTarget.value }))
          }
        />
        <TextInput
          label={t('campos.descricao')}
          value={listagem.filtroPendente.descricao ?? ''}
          onChange={(e) =>
            listagem.setFiltroPendente((f) => ({ ...f, descricao: e.currentTarget.value }))
          }
        />
        <Button onClick={listagem.aplicarFiltros}>{t('comum.filtrar')}</Button>
        <Button variant="default" onClick={listagem.limparFiltros}>
          {t('comum.limpar')}
        </Button>
      </Group>

      <DataTable<Categoria>
        carregando={listagem.carregando}
        dados={listagem.dados?.conteudo ?? []}
        obterId={(c) => c.id}
        paginaAtual={listagem.dados?.pagina}
        totalPaginas={listagem.dados?.totalPaginas}
        aoMudarPagina={listagem.setPagina}
        colunas={colunas}
      />

      <CategoriaFormModal
        aberto={modalForm.aberto}
        aoFechar={modalForm.fechar}
        categoria={modalForm.dados}
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
