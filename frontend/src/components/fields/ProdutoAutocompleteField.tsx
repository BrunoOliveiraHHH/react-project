/**
 * ProdutoAutocompleteField — autocomplete server-side de produtos.
 *
 * 📚 CONCEITO REACT: Combobox controlado + debounce + useQuery condicional.
 *
 * 🎯 O QUE FAZ:
 *  - Enquanto o usuário digita menos de 3 caracteres, NÃO chama o backend.
 *  - A partir do 3º caractere, dispara busca debounced (300 ms) ao
 *    `GET /api/produtos?nome=...&page=0&size=20`.
 *  - O valor armazenado no form é o `produtoId` (number); o que aparece para
 *    o usuário é o nome do produto.
 *
 * 🔁 PARALELO COM VUE/QUASAR:
 *  - É o equivalente ao `q-select` com `use-input` + `@filter` async do Quasar.
 *  - Ou ao `<v-autocomplete :items="..." :loading="..." @update:search="...">`
 *    do Vuetify.
 *
 * 💡 POR QUE NÃO LISTA COMPLETA:
 *  - Catálogos de produtos podem ter milhares de itens; carregar tudo é caro
 *    em rede e em memória do browser. Buscar pela 3ª letra é o padrão clássico
 *    de autocomplete remoto.
 *
 * 🌍 OUTROS CASOS DE USO:
 *  - Qualquer FK cuja tabela referenciada pode ser grande (clientes, NCMs,
 *    contas contábeis, CIDs, CFOPs etc.).
 *
 * Implementação:
 *  - Mantine `Combobox` de baixo nível dá controle total; aqui usamos o
 *    componente `Select` + `searchValue` controlado, que é mais simples e
 *    cobre o caso de uso.
 */
import { useMemo, useState } from 'react';
import { Loader, Select } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { Controller, useFormContext } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { produtoService } from '../../api/produtoService';
import type { Produto } from '../../types/api';

const MIN_CARACTERES_BUSCA = 3;
const DEBOUNCE_MS = 300;

interface Props {
  name: string;
  rotulo?: string;
  obrigatorio?: boolean;
  desabilitado?: boolean;
  placeholder?: string;
}

export function ProdutoAutocompleteField({
  name,
  rotulo,
  obrigatorio,
  desabilitado,
  placeholder,
}: Props) {
  const { t } = useTranslation();
  const { control } = useFormContext();

  // Texto digitado pelo usuário (≠ valor selecionado).
  // 🔁 Vue: const busca = ref('');
  const [busca, setBusca] = useState('');

  // useDebouncedValue (do Mantine) — espera o usuário parar de digitar.
  // 🔁 Vue: você usaria `useDebounce` do VueUse.
  const [buscaDebounced] = useDebouncedValue(busca, DEBOUNCE_MS);

  // Habilita a query somente a partir da 3ª letra. `enabled: false` impede
  // que o useQuery dispare HTTP para textos curtos.
  const habilitado = buscaDebounced.trim().length >= MIN_CARACTERES_BUSCA;

  const { data, isFetching } = useQuery({
    queryKey: ['produtos-busca', buscaDebounced],
    queryFn: () =>
      produtoService.listar(
        { nome: buscaDebounced.trim() },
        { page: 0, size: 20, sort: 'nome,asc' },
      ),
    enabled: habilitado,
  });

  const produtosEncontrados: Produto[] = data?.conteudo ?? [];

  const opcoes = useMemo(
    () =>
      produtosEncontrados.map((p) => ({
        value: String(p.id),
        label: `${p.nome} — estoque: ${p.estoque}`,
      })),
    [produtosEncontrados],
  );

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Select
          label={rotulo ?? t('campos.produto')}
          placeholder={
            placeholder ?? `${t('comum.buscar')}... (mín. ${MIN_CARACTERES_BUSCA} letras)`
          }
          withAsterisk={obrigatorio}
          disabled={desabilitado}
          error={fieldState.error?.message}
          searchable
          clearable
          // Indicador de carregamento à direita enquanto há fetch em andamento.
          rightSection={isFetching ? <Loader size="xs" /> : null}
          // `searchValue` controla o texto exibido e pesquisado.
          searchValue={busca}
          onSearchChange={setBusca}
          // Mostra "nada encontrado" só quando JÁ buscou; antes do mínimo,
          // mostra dica para o usuário continuar digitando.
          nothingFoundMessage={
            habilitado ? t('comum.vazio') : `Digite ao menos ${MIN_CARACTERES_BUSCA} letras`
          }
          data={opcoes}
          value={field.value != null ? String(field.value) : null}
          onChange={(v) => field.onChange(v == null ? undefined : Number(v))}
          onBlur={field.onBlur}
          name={field.name}
          // Mantém a opção selecionada visível mesmo se sumir do resultado da
          // busca atual (ex.: usuário apaga o texto).
          allowDeselect
        />
      )}
    />
  );
}
