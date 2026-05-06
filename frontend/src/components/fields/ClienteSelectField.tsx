/**
 * ClienteSelectField — Select de cliente (FK).
 *
 * 📚 Mesma ideia do {@link CategoriaSelectField}: carrega a lista completa de
 * clientes e expõe um SelectField pronto para uso. Usado em formulários onde
 * um cliente é referenciado (ex.: filtro de vendas).
 *
 * 💡 POR QUE LISTA COMPLETA E NÃO BUSCA ASSÍNCRONA:
 *  - Para lojas pequenas/médias o volume de clientes cabe em memória.
 *  - Caso o catálogo de clientes cresça muito, troque por um padrão de
 *    autocomplete server-side (ver {@link ProdutoAutocompleteField}).
 */
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { SelectField } from './SelectField';
import { clienteService } from '../../api/clienteService';

interface Props {
  name: string;
  rotulo?: string;
  obrigatorio?: boolean;
  desabilitado?: boolean;
  placeholder?: string;
}

export function ClienteSelectField({ name, rotulo, obrigatorio, desabilitado, placeholder }: Props) {
  const { t } = useTranslation();

  const { data: clientes = [], isLoading } = useQuery({
    queryKey: ['clientes-todos'],
    queryFn: () => clienteService.listarTodos(),
  });

  const opcoes = useMemo(
    () => clientes.map((c) => ({ value: String(c.id), label: c.nome })),
    [clientes],
  );

  return (
    <SelectField
      name={name}
      rotulo={rotulo ?? t('campos.cliente')}
      opcoes={opcoes}
      obrigatorio={obrigatorio}
      desabilitado={desabilitado || isLoading}
      placeholder={placeholder}
      numerico
    />
  );
}
