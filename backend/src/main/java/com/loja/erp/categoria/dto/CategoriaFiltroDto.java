package com.loja.erp.categoria.dto;

/**
 * Filtros opcionais para listagem paginada de categorias.
 * Todos os campos são opcionais — null/vazio significa "sem filtro".
 */
public record CategoriaFiltroDto(
        String nome,
        String descricao
) {}
