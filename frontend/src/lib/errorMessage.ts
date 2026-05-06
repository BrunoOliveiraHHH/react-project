/**
 * Normaliza erros do axios → mensagem amigável para a UI.
 *
 * 🎯 NÍVEL SÊNIOR: tratar erros num único ponto evita lógica `try/catch`
 * espalhada em cada mutation. O backend devolve `ProblemDetail` (RFC 7807),
 * então temos `detail`, `title` e `status` previsíveis.
 */
import { AxiosError, isAxiosError } from 'axios';

interface ProblemDetail {
  title?: string;
  detail?: string;
  status?: number;
  erros?: Record<string, string>;
}

export function mensagemDeErro(erro: unknown, fallback = 'Erro inesperado'): string {
  if (isAxiosError(erro)) {
    const axErr = erro as AxiosError<ProblemDetail>;
    const data = axErr.response?.data;

    if (data?.erros) {
      // Erros de validação Bean Validation → primeira mensagem.
      const primeira = Object.values(data.erros)[0];
      if (primeira) return primeira;
    }
    if (data?.detail) return data.detail;
    if (data?.title) return data.title;
    if (axErr.message) return axErr.message;
  }
  if (erro instanceof Error) return erro.message;
  return fallback;
}
