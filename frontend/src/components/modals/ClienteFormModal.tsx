/**
 * ClienteFormModal — cadastro/edição de cliente.
 */
import { Button } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { Modal } from '../ui/Modal';
import { Formulario } from '../fields/FormProvider';
import { TextField } from '../fields/TextField';
import { clienteService } from '../../api/clienteService';
import { useCrudMutation } from '../../hooks/useCrudMutations';
import { queryKeys } from '../../lib/queryKeys';
import type { Cliente } from '../../types/api';

const schema = z.object({
  nome: z.string().min(1).max(120),
  cpf: z.string().min(11).max(14),
  email: z.string().email().max(120).optional().or(z.literal('')),
  telefone: z.string().max(20).optional().or(z.literal('')),
});
type ClienteForm = z.infer<typeof schema>;

interface Props {
  aberto: boolean;
  aoFechar: () => void;
  cliente: Cliente | null;
}

export function ClienteFormModal({ aberto, aoFechar, cliente }: Props) {
  const { t } = useTranslation();

  const mutation = useCrudMutation({
    acao: (d: ClienteForm) => {
      const payload = {
        nome: d.nome,
        cpf: d.cpf,
        email: d.email || undefined,
        telefone: d.telefone || undefined,
      };
      return cliente
        ? clienteService.atualizar(cliente.id, payload)
        : clienteService.cadastrar(payload);
    },
    invalidar: [queryKeys.clientes.all],
    mensagemSucesso: 'Cliente salvo!',
    aoSucesso: aoFechar,
  });

  return (
    <Modal
      aberto={aberto}
      aoFechar={aoFechar}
      titulo={cliente ? t('comum.editar') : t('comum.novo')}
    >
      <Formulario<ClienteForm>
        key={cliente?.id ?? 'novo'}
        formId="form-cliente"
        schema={schema}
        valoresIniciais={{
          nome: cliente?.nome ?? '',
          cpf: cliente?.cpf ?? '',
          email: cliente?.email ?? '',
          telefone: cliente?.telefone ?? '',
        }}
        aoSubmeter={(d) => mutation.mutate(d)}
      >
        <TextField name="nome" rotulo={t('campos.nome')} obrigatorio />
        <TextField name="cpf" rotulo={t('campos.cpf')} obrigatorio />
        <TextField name="email" rotulo={t('campos.email')} type="email" />
        <TextField name="telefone" rotulo={t('campos.telefone')} />
      </Formulario>

      <Button variant="default" onClick={aoFechar} disabled={mutation.isPending}>
        {t('comum.cancelar')}
      </Button>
      <Button type="submit" form="form-cliente" loading={mutation.isPending}>
        {t('comum.salvar')}
      </Button>
    </Modal>
  );
}
