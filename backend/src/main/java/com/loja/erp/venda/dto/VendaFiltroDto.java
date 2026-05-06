package com.loja.erp.venda.dto;

import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

public record VendaFiltroDto(
        Long clienteId,
        Long produtoId,
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim
) {}
