package com.loja.erp.venda.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record VendaResponseDto(
        Long id,
        Long clienteId,
        String clienteNome,
        Long produtoId,
        String produtoNome,
        Integer quantidade,
        BigDecimal valorTotal,
        LocalDateTime dataVenda
) {}
