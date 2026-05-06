package com.loja.erp.produto;

import com.loja.erp.common.PaginaDto;
import com.loja.erp.produto.dto.ProdutoFiltroDto;
import com.loja.erp.produto.dto.ProdutoRequestDto;
import com.loja.erp.produto.dto.ProdutoResponseDto;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/produtos")
@Tag(name = "Produtos")
public class ProdutoController {

    private final ProdutoService service;

    public ProdutoController(ProdutoService service) {
        this.service = service;
    }

    @GetMapping
    public PaginaDto<ProdutoResponseDto> listar(
            @ModelAttribute ProdutoFiltroDto filtro,
            @PageableDefault(size = 10, sort = "nome") Pageable pageable) {
        return service.listarPaginado(filtro, pageable);
    }

    @GetMapping("/{id}")
    public ProdutoResponseDto buscar(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    public ResponseEntity<ProdutoResponseDto> cadastrar(@Valid @RequestBody ProdutoRequestDto dto) {
        ProdutoResponseDto criado = service.cadastrar(dto);
        return ResponseEntity.created(URI.create("/api/produtos/" + criado.id())).body(criado);
    }

    @PutMapping("/{id}")
    public ProdutoResponseDto atualizar(@PathVariable Long id, @Valid @RequestBody ProdutoRequestDto dto) {
        return service.atualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        service.remover(id);
        return ResponseEntity.noContent().build();
    }
}
