package com.loja.erp.common;

import org.springframework.data.domain.Page;

import java.util.List;

/**
 * Envelope de paginação enviado ao frontend.
 * Usamos um DTO próprio (em PT-BR) ao invés de expor o {@code Page} do Spring.
 */
public record PaginaDto<T>(
        List<T> conteudo,
        int pagina,
        int tamanho,
        long totalElementos,
        int totalPaginas,
        boolean ultima
) {
    public static <T> PaginaDto<T> de(Page<T> page) {
        return new PaginaDto<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }
}
