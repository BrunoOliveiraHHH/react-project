/**
 * useCrudMutations — fábrica genérica de mutations para um recurso.
 *
 * 🎯 NÍVEL SÊNIOR:
 *   - Centraliza padrão de save/delete + toast + invalidação de cache.
 *   - Erros normalizados via {@link mensagemDeErro}.
 *   - Aceita callbacks para fluxos específicos (ex.: fechar modal no sucesso).
 *
 * 💡 POR QUE NÃO USAR DIRETO useMutation:
 *   - Reduz boilerplate em 5 modais (cliente, produto, categoria, venda, etc).
 *   - Garante consistência: TODOS os erros mostram a mesma forma de mensagem.
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { QueryKey } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { mensagemDeErro } from '../lib/errorMessage';

interface OpcoesCrud<TPayload, TResposta> {
  /** Função que executa POST/PUT (save) ou DELETE. */
  acao: (payload: TPayload) => Promise<TResposta>;
  /** Chaves de cache a invalidar no sucesso. */
  invalidar: QueryKey[];
  /** Mensagem de sucesso (toast). */
  mensagemSucesso?: string;
  /** Callback opcional após sucesso (ex.: fechar modal). */
  aoSucesso?: (resposta: TResposta) => void;
}

export function useCrudMutation<TPayload, TResposta>(opcoes: OpcoesCrud<TPayload, TResposta>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: opcoes.acao,
    onSuccess: async (resposta) => {
      await Promise.all(
        opcoes.invalidar.map((key) => queryClient.invalidateQueries({ queryKey: key })),
      );
      if (opcoes.mensagemSucesso) {
        notifications.show({ message: opcoes.mensagemSucesso, color: 'green' });
      }
      opcoes.aoSucesso?.(resposta);
    },
    onError: (erro) => {
      notifications.show({ message: mensagemDeErro(erro), color: 'red' });
    },
  });
}
