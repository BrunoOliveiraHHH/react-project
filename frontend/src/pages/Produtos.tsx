/**
 * Produtos.tsx — Listagem paginada com filtros + CRUD.
 */
import { ActionIcon, Button, Group, NumberInput, Stack, TextInput } from '@mantine/core';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useFormContext, useForm, FormProvider } from 'react-hook-form';

import { PageHeader } from '../components/ui/PageHeader';
import { DataTable } from '../components/ui/DataTable';
import type { ColunaTabela } from '../components/ui/DataTable';
import { ProdutoFormModal } from '../components/modals/ProdutoFormModal';
import { ConfirmacaoRemocaoModal } from '../components/modals/ConfirmacaoRemocaoModal';
import { CategoriaSelectField } from '../components/fields/CategoriaSelectField';
import { useAberturaModal } from '../hooks/useAberturaModal';
import { useListagemPaginada } from '../hooks/useListagemPaginada';
import { useCrudMutation } from '../hooks/useCrudMutations';
import { produtoService } from '../api/produtoService';
import { queryKeys } from '../lib/queryKeys';
import { formatarMoeda } from '../lib/format';
import type { Produto, ProdutoFiltro } from '../types/api';

const FILTRO_INICIAL: ProdutoFiltro = {};

export default function Produtos() {
  const { t } = useTranslation();

  const listagem = useListagemPaginada<ProdutoFiltro, Produto>({
    queryKey: queryKeys.produtos.lista,
    buscar: produtoService.listar,
    sort: 'nome,asc',
    filtroInicial: FILTRO_INICIAL,
  });

  // Form-context só para o filtro de categoria (CategoriaSelectField precisa de RHF).
  const filtroForm = useForm<{ categoriaId: number | undefined }>({
    defaultValues: { categoriaId: undefined },
  });

  const modalForm = useAberturaModal<Produto>();
  const modalRemocao = useAberturaModal<Produto>();

  const remover = useCrudMutation({
    acao: (id: number) => produtoService.remover(id),
    invalidar: [queryKeys.produtos.all],
    mensagemSucesso: 'Removido!',
    aoSucesso: modalRemocao.fechar,
  });

  const aplicarFiltros = () => {
    listagem.setFiltroPendente((f) => ({ ...f, categoriaId: filtroForm.getValues('categoriaId') }));
    listagem.aplicarFiltros();
  };

  const limparFiltros = () => {
    filtroForm.reset({ categoriaId: undefined });
    listagem.limparFiltros();
  };

  const colunas: ColunaTabela<Produto>[] = [
    { id: 'nome', rotulo: t('campos.nome'), chave: 'nome' },
    { id: 'sku', rotulo: t('campos.sku'), chave: 'sku' },
    { id: 'categoria', rotulo: t('campos.categoria'), chave: 'categoriaNome' },
    {
      id: 'preco',
      rotulo: t('campos.preco'),
      renderizar: (p) => formatarMoeda(p.preco),
    },
    { id: 'estoque', rotulo: t('campos.estoque'), chave: 'estoque' },
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
        titulo={t('menu.produtos')}
        acoes={
          <Button leftSection={<IconPlus size={16} />} onClick={() => modalForm.abrir()}>
            {t('comum.novo')}
          </Button>
        }
      />

      <FormProvider {...filtroForm}>
        <Group align="flex-end" wrap="wrap">
          <TextInput
            label={t('campos.nome')}
            value={listagem.filtroPendente.nome ?? ''}
            onChange={(e) =>
              listagem.setFiltroPendente((f) => ({ ...f, nome: e.currentTarget.value }))
            }
          />
          <TextInput
            label={t('campos.sku')}
            value={listagem.filtroPendente.sku ?? ''}
            onChange={(e) =>
              listagem.setFiltroPendente((f) => ({ ...f, sku: e.currentTarget.value }))
            }
          />
          <FiltroCategoria />
          <NumberInput
            label={t('campos.precoMin')}
            value={listagem.filtroPendente.precoMin ?? ''}
            onChange={(v) =>
              listagem.setFiltroPendente((f) => ({
                ...f,
                precoMin: v === '' ? undefined : Number(v),
              }))
            }
            min={0}
            decimalScale={2}
          />
          <NumberInput
            label={t('campos.precoMax')}
            value={listagem.filtroPendente.precoMax ?? ''}
            onChange={(v) =>
              listagem.setFiltroPendente((f) => ({
                ...f,
                precoMax: v === '' ? undefined : Number(v),
              }))
            }
            min={0}
            decimalScale={2}
          />
          <Button onClick={aplicarFiltros}>{t('comum.filtrar')}</Button>
          <Button variant="default" onClick={limparFiltros}>
            {t('comum.limpar')}
          </Button>
        </Group>
      </FormProvider>

      <DataTable<Produto>
        carregando={listagem.carregando}
        dados={listagem.dados?.conteudo ?? []}
        obterId={(p) => p.id}
        paginaAtual={listagem.dados?.pagina}
        totalPaginas={listagem.dados?.totalPaginas}
        aoMudarPagina={listagem.setPagina}
        colunas={colunas}
      />

      <ProdutoFormModal
        aberto={modalForm.aberto}
        aoFechar={modalForm.fechar}
        produto={modalForm.dados}
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

/** Subcomponente: precisa estar dentro do FormProvider para acessar context. */
function FiltroCategoria() {
  // useFormContext apenas para garantir que está dentro do Provider — o
  // CategoriaSelectField usa Controller internamente.
  useFormContext();
  return <CategoriaSelectField name="categoriaId" />;
}
