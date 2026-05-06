package com.loja.erp.categoria.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoriaRequestDto(
        @NotBlank @Size(max = 80) String nome,
        @Size(max = 255) String descricao
) {}
