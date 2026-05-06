package com.loja.erp.produto.dto;

import java.math.BigDecimal;

public record ProdutoResponseDto(
        Long id,
        String nome,
        String sku,
        BigDecimal preco,
        Integer estoque,
        Long categoriaId,
        String categoriaNome
) {}
