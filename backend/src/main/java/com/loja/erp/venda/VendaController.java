package com.loja.erp.venda;

import com.loja.erp.common.PaginaDto;
import com.loja.erp.venda.dto.VendaFiltroDto;
import com.loja.erp.venda.dto.VendaRequestDto;
import com.loja.erp.venda.dto.VendaResponseDto;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/vendas")
@Tag(name = "Vendas")
public class VendaController {

    private final VendaService service;

    public VendaController(VendaService service) {
        this.service = service;
    }

    @GetMapping
    public PaginaDto<VendaResponseDto> listar(
            @ModelAttribute VendaFiltroDto filtro,
            @PageableDefault(size = 10, sort = "dataVenda", direction = Sort.Direction.DESC) Pageable pageable) {
        return service.listarPaginado(filtro, pageable);
    }

    @GetMapping("/{id}")
    public VendaResponseDto buscar(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    public ResponseEntity<VendaResponseDto> cadastrar(@Valid @RequestBody VendaRequestDto dto) {
        VendaResponseDto criada = service.cadastrar(dto);
        return ResponseEntity.created(URI.create("/api/vendas/" + criada.id())).body(criada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        service.remover(id);
        return ResponseEntity.noContent().build();
    }
}
