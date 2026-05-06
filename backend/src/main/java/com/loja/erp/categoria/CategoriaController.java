package com.loja.erp.categoria;

import com.loja.erp.categoria.dto.CategoriaFiltroDto;
import com.loja.erp.categoria.dto.CategoriaRequestDto;
import com.loja.erp.categoria.dto.CategoriaResponseDto;
import com.loja.erp.common.PaginaDto;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@Tag(name = "Categorias")
public class CategoriaController {

    private final CategoriaService service;

    public CategoriaController(CategoriaService service) {
        this.service = service;
    }

    /**
     * Lista paginada com filtros via query string.
     * Ex.: GET /api/categorias?page=0&size=10&sort=nome,asc&nome=bebid
     */
    @GetMapping
    public PaginaDto<CategoriaResponseDto> listar(
            @ModelAttribute CategoriaFiltroDto filtro,
            @PageableDefault(size = 10, sort = "nome") Pageable pageable) {
        return service.listarPaginado(filtro, pageable);
    }

    /** Atalho sem paginação (usado em selects do front). */
    @GetMapping("/todas")
    public List<CategoriaResponseDto> listarTodas() {
        return service.listarTodas();
    }

    @GetMapping("/{id}")
    public CategoriaResponseDto buscar(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    public ResponseEntity<CategoriaResponseDto> cadastrar(@Valid @RequestBody CategoriaRequestDto dto) {
        CategoriaResponseDto criado = service.cadastrar(dto);
        return ResponseEntity.created(URI.create("/api/categorias/" + criado.id())).body(criado);
    }

    @PutMapping("/{id}")
    public CategoriaResponseDto atualizar(@PathVariable Long id, @Valid @RequestBody CategoriaRequestDto dto) {
        return service.atualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        service.remover(id);
        return ResponseEntity.noContent().build();
    }
}
