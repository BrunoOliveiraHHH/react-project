package com.loja.erp.venda;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface VendaRepository extends JpaRepository<Venda, Long>,
        JpaSpecificationExecutor<Venda> {

    @Query("SELECT COALESCE(SUM(v.valorTotal), 0) FROM Venda v WHERE v.dataVenda >= :inicio")
    BigDecimal somarFaturamentoDesde(LocalDateTime inicio);

    long countByDataVendaGreaterThanEqual(LocalDateTime inicio);
}
