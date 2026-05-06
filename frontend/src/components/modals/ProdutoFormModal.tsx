/**
 * ProdutoFormModal — cadastro/edição de produto.
 * Usa CategoriaSelectField (FK), CurrencyField e NumberField.
 */
import { Button } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { Modal } from '../ui/Modal';
import { Formulario } from '../fields/FormProvider';
import { TextField } from '../fields/TextField';
import { NumberField } from '../fields/NumberField';
import { CurrencyField } from '../fields/CurrencyField';
import { CategoriaSelectField } from '../fields/CategoriaSelectField';
import { produtoService } from '../../api/produtoService';
import { useCrudMutation } from '../../hooks/useCrudMutations';
import { queryKeys } from '../../lib/queryKeys';
import type { Produto } from '../../types/api';

const schema = z.object({
  nome: z.string().min(1).max(120),
  sku: z.string().min(1).max(40),
  preco: z.number().nonnegative(),
  estoque: z.number().int().nonnegative(),
  categoriaId: z.number().int().positive(),
});
type ProdutoForm = z.infer<typeof schema>;

interface Props {
  aberto: boolean;
  aoFechar: () => void;
  produto: Produto | null;
}

export function ProdutoFormModal({ aberto, aoFechar, produto }: Props) {
  const { t } = useTranslation();

  const mutation = useCrudMutation({
    acao: (dados: ProdutoForm) =>
      produto ? produtoService.atualizar(produto.id, dados) : produtoService.cadastrar(dados),
    invalidar: [queryKeys.produtos.all],
    mensagemSucesso: 'Produto salvo!',
    aoSucesso: aoFechar,
  });

  return (
    <Modal
      aberto={aberto}
      aoFechar={aoFechar}
      titulo={produto ? t('comum.editar') : t('comum.novo')}
      tamanho="lg"
    >
      <Formulario<ProdutoForm>
        key={produto?.id ?? 'novo'}
        formId="form-produto"
        schema={schema}
        valoresIniciais={{
          nome: produto?.nome ?? '',
          sku: produto?.sku ?? '',
          preco: produto?.preco ?? 0,
          estoque: produto?.estoque ?? 0,
          categoriaId: produto?.categoriaId ?? 0,
        }}
        aoSubmeter={(d) => mutation.mutate(d)}
      >
        <TextField name="nome" rotulo={t('campos.nome')} obrigatorio />
        <TextField name="sku" rotulo={t('campos.sku')} obrigatorio />
        <CurrencyField name="preco" rotulo={t('campos.preco')} obrigatorio />
        <NumberField name="estoque" rotulo={t('campos.estoque')} obrigatorio min={0} />
        <CategoriaSelectField name="categoriaId" obrigatorio />
      </Formulario>

      <Button variant="default" onClick={aoFechar} disabled={mutation.isPending}>
        {t('comum.cancelar')}
      </Button>
      <Button type="submit" form="form-produto" loading={mutation.isPending}>
        {t('comum.salvar')}
      </Button>
    </Modal>
  );
}
