package com.loja.erp.venda.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record VendaRequestDto(
        @NotNull Long clienteId,
        @NotNull Long produtoId,
        @NotNull @Min(1) Integer quantidade
) {}
