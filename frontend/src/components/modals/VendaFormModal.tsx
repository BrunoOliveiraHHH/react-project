/**
 * VendaFormModal — cadastro de venda. Sem edição.
 * Usa ClienteSelectField + ProdutoAutocompleteField (busca a partir da 3ª letra).
 */
import { Button } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { Modal } from '../ui/Modal';
import { Formulario } from '../fields/FormProvider';
import { NumberField } from '../fields/NumberField';
import { ClienteSelectField } from '../fields/ClienteSelectField';
import { ProdutoAutocompleteField } from '../fields/ProdutoAutocompleteField';
import { vendaService } from '../../api/vendaService';
import { useCrudMutation } from '../../hooks/useCrudMutations';
import { queryKeys } from '../../lib/queryKeys';

const schema = z.object({
  clienteId: z.number().int().positive(),
  produtoId: z.number().int().positive(),
  quantidade: z.number().int().positive(),
});
type VendaForm = z.infer<typeof schema>;

interface Props {
  aberto: boolean;
  aoFechar: () => void;
}

export function VendaFormModal({ aberto, aoFechar }: Props) {
  const { t } = useTranslation();

  const mutation = useCrudMutation({
    acao: (d: VendaForm) => vendaService.cadastrar(d),
    invalidar: [queryKeys.vendas.all, queryKeys.produtos.all, queryKeys.dashboard.resumo()],
    mensagemSucesso: 'Venda registrada!',
    aoSucesso: aoFechar,
  });

  return (
    <Modal aberto={aberto} aoFechar={aoFechar} titulo={t('comum.novo')} tamanho="md">
      <Formulario<VendaForm>
        key={aberto ? 'aberto' : 'fechado'}
        formId="form-venda"
        schema={schema}
        valoresIniciais={{ clienteId: 0, produtoId: 0, quantidade: 1 }}
        aoSubmeter={(d) => mutation.mutate(d)}
      >
        <ClienteSelectField name="clienteId" obrigatorio />
        <ProdutoAutocompleteField name="produtoId" obrigatorio />
        <NumberField name="quantidade" rotulo={t('campos.quantidade')} obrigatorio min={1} />
      </Formulario>

      <Button variant="default" onClick={aoFechar} disabled={mutation.isPending}>
        {t('comum.cancelar')}
      </Button>
      <Button type="submit" form="form-venda" loading={mutation.isPending}>
        {t('comum.salvar')}
      </Button>
    </Modal>
  );
}
