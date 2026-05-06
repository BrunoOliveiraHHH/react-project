/**
 * CategoriaSelectField — campo Select especializado em Categoria.
 *
 * 📚 CONCEITO REACT: composição de um SelectField genérico com lógica de
 * domínio (busca de categorias). Encapsula o useQuery + transformação em
 * opções para que páginas/modais simplesmente declarem `<CategoriaSelectField />`.
 *
 * 🔁 PARALELO COM VUE/QUASAR:
 *  - Equivalente a um `BaseCategoriaSelect.vue` que internamente faz
 *    `const { data } = useQuery(...)` e expõe um `q-select` configurado.
 *
 * 💡 POR QUE EXISTIR (em vez de só usar SelectField):
 *  - Evita duplicar `useQuery(['categorias-todas'], ...)` em cada modal/filtro.
 *  - Centraliza a queryKey — invalidação após criar uma nova categoria atinge
 *    todos os selects automaticamente.
 *  - Tipagem do `name` continua flexível (qualquer campo numérico do form).
 *
 * 🌍 OUTROS CASOS DE USO:
 *  - `ClienteSelectField`, `ProdutoSelectField` etc. seguem o mesmo padrão.
 *  - Sempre que a mesma "fonte de dados + transformação em opções" se repete
 *    em 2+ lugares.
 */
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { SelectField } from './SelectField';
import { categoriaService } from '../../api/categoriaService';

interface CategoriaSelectFieldProps {
  /** Nome do campo no form (path em react-hook-form). */
  name: string;
  /** Rótulo customizado — se omitido, usa o tradução padrão "Categoria". */
  rotulo?: string;
  obrigatorio?: boolean;
  desabilitado?: boolean;
  placeholder?: string;
}

export function CategoriaSelectField({
  name,
  rotulo,
  obrigatorio,
  desabilitado,
  placeholder,
}: CategoriaSelectFieldProps) {
  const { t } = useTranslation();

  // Carrega todas as categorias uma vez (cache compartilhado pela queryKey).
  // 🔁 Vue: const { data } = useQuery(['categorias-todas'], ...)
  const { data: categorias = [], isLoading } = useQuery({
    queryKey: ['categorias-todas'],
    queryFn: () => categoriaService.listarTodas(),
  });

  // useMemo — recomputa opções apenas quando categorias mudam.
  // 🔁 Vue: computed(() => categorias.value.map(...))
  const opcoes = useMemo(
    () => categorias.map((c) => ({ value: String(c.id), label: c.nome })),
    [categorias],
  );

  return (
    <SelectField
      name={name}
      rotulo={rotulo ?? t('campos.categoria')}
      opcoes={opcoes}
      obrigatorio={obrigatorio}
      desabilitado={desabilitado || isLoading}
      placeholder={placeholder}
      numerico
    />
  );
}
