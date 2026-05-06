package com.loja.erp.cliente.dto;

public record ClienteResponseDto(
        Long id,
        String nome,
        String cpf,
        String email,
        String telefone
) {}
