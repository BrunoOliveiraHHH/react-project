package com.loja.erp.cliente.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ClienteRequestDto(
        @NotBlank @Size(max = 120) String nome,
        @NotBlank @Size(min = 11, max = 14) String cpf,
        @Email @Size(max = 120) String email,
        @Size(max = 20) String telefone
) {}
