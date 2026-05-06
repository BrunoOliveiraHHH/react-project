/**
 * CategoriaFormModal — cadastro/edição de categoria.
 *
 * ✅ NÍVEL SÊNIOR:
 *   - Reset entre edições resolvido com `key={categoria?.id ?? 'novo'}` no
 *     <Formulario> (re-monta com defaultValues novos). Evita useEffect
 *     desnecessário e bugs sutis de reset.
 *   - Mutation centralizada via {@link useCrudMutation}.
 *   - Schema zod = fonte da verdade do tipo do form.
 */
import { Button } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { Modal } from '../ui/Modal';
import { Formulario } from '../fields/FormProvider';
import { TextField } from '../fields/TextField';
import { categoriaService } from '../../api/categoriaService';
import { useCrudMutation } from '../../hooks/useCrudMutations';
import { queryKeys } from '../../lib/queryKeys';
import type { Categoria } from '../../types/api';

const schema = z.object({
  nome: z.string().min(1, 'Obrigatório').max(80),
  descricao: z.string().max(255).optional(),
});
type CategoriaForm = z.infer<typeof schema>;

interface Props {
  aberto: boolean;
  aoFechar: () => void;
  categoria: Categoria | null;
}

export function CategoriaFormModal({ aberto, aoFechar, categoria }: Props) {
  const { t } = useTranslation();

  const mutation = useCrudMutation({
    acao: (dados: CategoriaForm) =>
      categoria
        ? categoriaService.atualizar(categoria.id, dados)
        : categoriaService.cadastrar(dados),
    invalidar: [queryKeys.categorias.all],
    mensagemSucesso: 'Categoria salva!',
    aoSucesso: aoFechar,
  });

  return (
    <Modal
      aberto={aberto}
      aoFechar={aoFechar}
      titulo={categoria ? t('comum.editar') : t('comum.novo')}
    >
      {/* `key` re-monta o form quando a entidade muda — reset idiomático. */}
      <Formulario<CategoriaForm>
        key={categoria?.id ?? 'novo'}
        formId="form-categoria"
        schema={schema}
        valoresIniciais={{
          nome: categoria?.nome ?? '',
          descricao: categoria?.descricao ?? '',
        }}
        aoSubmeter={(dados) => mutation.mutate(dados)}
      >
        <TextField name="nome" rotulo={t('campos.nome')} obrigatorio />
        <TextField name="descricao" rotulo={t('campos.descricao')} />
      </Formulario>

      <Button variant="default" onClick={aoFechar} disabled={mutation.isPending}>
        {t('comum.cancelar')}
      </Button>
      <Button type="submit" form="form-categoria" loading={mutation.isPending}>
        {t('comum.salvar')}
      </Button>
    </Modal>
  );
}
