package com.loja.erp.produto.dto;

import java.math.BigDecimal;

public record ProdutoFiltroDto(
        String nome,
        String sku,
        Long categoriaId,
        BigDecimal precoMin,
        BigDecimal precoMax
) {}
