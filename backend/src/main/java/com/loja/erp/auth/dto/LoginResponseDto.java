package com.loja.erp.auth.dto;

public record LoginResponseDto(
        String token,
        String username,
        String role
) {}
