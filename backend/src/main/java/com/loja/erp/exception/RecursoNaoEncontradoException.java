package com.loja.erp.exception;

/**
 * Lançada quando uma entidade não é encontrada por id.
 * O {@link GlobalExceptionHandler} converte para HTTP 404.
 */
public class RecursoNaoEncontradoException extends RuntimeException {
    public RecursoNaoEncontradoException(String mensagem) {
        super(mensagem);
    }

    public static RecursoNaoEncontradoException paraId(String entidade, Object id) {
        return new RecursoNaoEncontradoException(entidade + " com id " + id + " não encontrado(a).");
    }
}
