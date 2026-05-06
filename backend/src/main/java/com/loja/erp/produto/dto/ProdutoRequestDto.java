package com.loja.erp.produto.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record ProdutoRequestDto(
        @NotBlank @Size(max = 120) String nome,
        @NotBlank @Size(max = 40) String sku,
        @NotNull @DecimalMin(value = "0.00") BigDecimal preco,
        @NotNull @Min(0) Integer estoque,
        @NotNull Long categoriaId
) {}
