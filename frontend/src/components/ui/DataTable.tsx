/**
 * DataTable — tabela genérica reutilizável.
 *
 * ✅ NÍVEL SÊNIOR:
 *   - Coluna é uma união discriminada: ou `chave: keyof T` (acessor seguro)
 *     ou `renderizar: (item: T) => ReactNode` (render arbitrário). Sem cast
 *     `as Record<string, unknown>`.
 *   - `id` derivado obrigatório quando T não tem `id` numérico/string —
 *     impede o anti-padrão de usar `index` como key.
 *   - `getRowKey` e `getCellValue` extraídos como utilitários.
 *
 * 🔁 PARALELO COM VUE/QUASAR:
 *   - `q-table` com `:columns="[{ field: 'x' } | { field: row => ... }]"`.
 */
import { Center, Loader, Pagination, Stack, Table, Text } from '@mantine/core';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Coluna baseada em uma chave do objeto (acessor seguro).
 * Type-safe: `chave` deve ser uma propriedade existente em T.
 */
interface ColunaPorChave<T> {
  id: string;
  rotulo: string;
  chave: keyof T;
  largura?: string | number;
  renderizar?: never;
}

/** Coluna com renderização customizada (ex.: ações, formatação complexa). */
interface ColunaCustomizada<T> {
  id: string;
  rotulo: string;
  chave?: never;
  renderizar: (item: T) => ReactNode;
  largura?: string | number;
}

export type ColunaTabela<T> = ColunaPorChave<T> | ColunaCustomizada<T>;

interface DataTableProps<T> {
  colunas: ColunaTabela<T>[];
  dados: T[];
  carregando?: boolean;
  paginaAtual?: number;
  totalPaginas?: number;
  aoMudarPagina?: (pagina: number) => void;
  /** Extrator de chave única para cada linha. */
  obterId: (item: T) => string | number;
}

export function DataTable<T>({
  colunas,
  dados,
  carregando = false,
  paginaAtual,
  totalPaginas,
  aoMudarPagina,
  obterId,
}: DataTableProps<T>) {
  const { t } = useTranslation();

  if (carregando) {
    return (
      <Center py="xl">
        <Loader />
      </Center>
    );
  }

  if (dados.length === 0) {
    return (
      <Center py="xl">
        <Text c="dimmed">{t('comum.vazio')}</Text>
      </Center>
    );
  }

  return (
    <Stack gap="md">
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            {colunas.map((c) => (
              <Table.Th key={c.id} style={{ width: c.largura }}>
                {c.rotulo}
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {dados.map((item) => (
            <Table.Tr key={obterId(item)}>
              {colunas.map((c) => (
                <Table.Td key={c.id}>{renderizarCelula(c, item)}</Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      {totalPaginas && totalPaginas > 1 && aoMudarPagina && (
        <Center>
          <Pagination
            total={totalPaginas}
            value={(paginaAtual ?? 0) + 1}
            onChange={(p) => aoMudarPagina(p - 1)}
          />
        </Center>
      )}
    </Stack>
  );
}

function renderizarCelula<T>(coluna: ColunaTabela<T>, item: T): ReactNode {
  if (coluna.renderizar) return coluna.renderizar(item);
  const valor = item[coluna.chave];
  return valor == null ? '' : String(valor);
}
