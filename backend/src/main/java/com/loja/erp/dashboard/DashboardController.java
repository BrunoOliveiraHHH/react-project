package com.loja.erp.dashboard;

import com.loja.erp.cliente.ClienteRepository;
import com.loja.erp.produto.ProdutoRepository;
import com.loja.erp.venda.VendaRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/dashboard")
@Tag(name = "Dashboard")
public class DashboardController {

    private final ProdutoRepository produtoRepository;
    private final ClienteRepository clienteRepository;
    private final VendaRepository vendaRepository;

    public DashboardController(ProdutoRepository produtoRepository,
                               ClienteRepository clienteRepository,
                               VendaRepository vendaRepository) {
        this.produtoRepository = produtoRepository;
        this.clienteRepository = clienteRepository;
        this.vendaRepository = vendaRepository;
    }

    public record ResumoDto(
            long totalProdutos,
            long totalClientes,
            long vendasHoje,
            BigDecimal faturamentoHoje
    ) {}

    @GetMapping("/resumo")
    public ResumoDto resumo() {
        var inicioDia = LocalDate.now().atStartOfDay();
        return new ResumoDto(
                produtoRepository.count(),
                clienteRepository.count(),
                vendaRepository.countByDataVendaGreaterThanEqual(inicioDia),
                vendaRepository.somarFaturamentoDesde(inicioDia)
        );
    }
}
