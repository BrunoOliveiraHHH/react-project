/**
 * Vendas.tsx — Listagem paginada com filtros + cadastro.
 */
import { ActionIcon, Button, Group, Stack } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import dayjs from 'dayjs';

import { PageHeader } from '../components/ui/PageHeader';
import { DataTable } from '../components/ui/DataTable';
import type { ColunaTabela } from '../components/ui/DataTable';
import { VendaFormModal } from '../components/modals/VendaFormModal';
import { ConfirmacaoRemocaoModal } from '../components/modals/ConfirmacaoRemocaoModal';
import { ClienteSelectField } from '../components/fields/ClienteSelectField';
import { ProdutoAutocompleteField } from '../components/fields/ProdutoAutocompleteField';
import { useAberturaModal } from '../hooks/useAberturaModal';
import { useListagemPaginada } from '../hooks/useListagemPaginada';
import { useCrudMutation } from '../hooks/useCrudMutations';
import { vendaService } from '../api/vendaService';
import { queryKeys } from '../lib/queryKeys';
import { formatarDataHora, formatarMoeda } from '../lib/format';
import type { Venda, VendaFiltro } from '../types/api';

const FILTRO_INICIAL: VendaFiltro = {};

export default function Vendas() {
  const { t } = useTranslation();

  const listagem = useListagemPaginada<VendaFiltro, Venda>({
    queryKey: queryKeys.vendas.lista,
    buscar: vendaService.listar,
    sort: 'dataVenda,desc',
    filtroInicial: FILTRO_INICIAL,
  });

  const filtroForm = useForm<{ clienteId?: number; produtoId?: number }>({
    defaultValues: { clienteId: undefined, produtoId: undefined },
  });

  const modalForm = useAberturaModal();
  const modalRemocao = useAberturaModal<Venda>();

  const remover = useCrudMutation({
    acao: (id: number) => vendaService.remover(id),
    invalidar: [queryKeys.vendas.all],
    mensagemSucesso: 'Removido!',
    aoSucesso: modalRemocao.fechar,
  });

  const aplicarFiltros = () => {
    listagem.setFiltroPendente((f) => ({
      ...f,
      clienteId: filtroForm.getValues('clienteId'),
      produtoId: filtroForm.getValues('produtoId'),
    }));
    listagem.aplicarFiltros();
  };

  const limparFiltros = () => {
    filtroForm.reset({ clienteId: undefined, produtoId: undefined });
    listagem.limparFiltros();
  };

  const colunas: ColunaTabela<Venda>[] = [
    { id: 'cliente', rotulo: t('campos.cliente'), chave: 'clienteNome' },
    { id: 'produto', rotulo: t('campos.produto'), chave: 'produtoNome' },
    { id: 'quantidade', rotulo: t('campos.quantidade'), chave: 'quantidade' },
    {
      id: 'valor',
      rotulo: t('campos.valorTotal'),
      renderizar: (v) => formatarMoeda(v.valorTotal),
    },
    {
      id: 'data',
      rotulo: t('campos.dataVenda'),
      renderizar: (v) => formatarDataHora(v.dataVenda),
    },
    {
      id: 'acoes',
      rotulo: t('comum.acoes'),
      largura: 80,
      renderizar: (item) => (
        <ActionIcon variant="light" color="red" onClick={() => modalRemocao.abrir(item)}>
          <IconTrash size={16} />
        </ActionIcon>
      ),
    },
  ];

  return (
    <Stack>
      <PageHeader
        titulo={t('menu.vendas')}
        acoes={
          <Button leftSection={<IconPlus size={16} />} onClick={() => modalForm.abrir()}>
            {t('comum.novo')}
          </Button>
        }
      />

      <FormProvider {...filtroForm}>
        <Group align="flex-end" wrap="wrap">
          <ClienteSelectField name="clienteId" />
          <ProdutoAutocompleteField name="produtoId" />
          <DateInput
            label={t('campos.dataInicio')}
            valueFormat="DD/MM/YYYY"
            clearable
            value={
              listagem.filtroPendente.dataInicio
                ? dayjs(listagem.filtroPendente.dataInicio).toDate()
                : null
            }
            onChange={(d) =>
              listagem.setFiltroPendente((f) => ({
                ...f,
                dataInicio: d ? dayjs(d).format('YYYY-MM-DD') : undefined,
              }))
            }
          />
          <DateInput
            label={t('campos.dataFim')}
            valueFormat="DD/MM/YYYY"
            clearable
            value={
              listagem.filtroPendente.dataFim
                ? dayjs(listagem.filtroPendente.dataFim).toDate()
                : null
            }
            onChange={(d) =>
              listagem.setFiltroPendente((f) => ({
                ...f,
                dataFim: d ? dayjs(d).format('YYYY-MM-DD') : undefined,
              }))
            }
          />
          <Button onClick={aplicarFiltros}>{t('comum.filtrar')}</Button>
          <Button variant="default" onClick={limparFiltros}>
            {t('comum.limpar')}
          </Button>
        </Group>
      </FormProvider>

      <DataTable<Venda>
        carregando={listagem.carregando}
        dados={listagem.dados?.conteudo ?? []}
        obterId={(v) => v.id}
        paginaAtual={listagem.dados?.pagina}
        totalPaginas={listagem.dados?.totalPaginas}
        aoMudarPagina={listagem.setPagina}
        colunas={colunas}
      />

      <VendaFormModal aberto={modalForm.aberto} aoFechar={modalForm.fechar} />
      <ConfirmacaoRemocaoModal
        aberto={modalRemocao.aberto}
        aoFechar={modalRemocao.fechar}
        carregando={remover.isPending}
        aoConfirmar={() => modalRemocao.dados && remover.mutate(modalRemocao.dados.id)}
      />
    </Stack>
  );
}
