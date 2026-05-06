package com.loja.erp.cliente;

import com.loja.erp.cliente.dto.ClienteFiltroDto;
import com.loja.erp.cliente.dto.ClienteRequestDto;
import com.loja.erp.cliente.dto.ClienteResponseDto;
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
@RequestMapping("/api/clientes")
@Tag(name = "Clientes")
public class ClienteController {

    private final ClienteService service;

    public ClienteController(ClienteService service) {
        this.service = service;
    }

    @GetMapping
    public PaginaDto<ClienteResponseDto> listar(
            @ModelAttribute ClienteFiltroDto filtro,
            @PageableDefault(size = 10, sort = "nome") Pageable pageable) {
        return service.listarPaginado(filtro, pageable);
    }

    @GetMapping("/todos")
    public List<ClienteResponseDto> listarTodos() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public ClienteResponseDto buscar(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    public ResponseEntity<ClienteResponseDto> cadastrar(@Valid @RequestBody ClienteRequestDto dto) {
        ClienteResponseDto criado = service.cadastrar(dto);
        return ResponseEntity.created(URI.create("/api/clientes/" + criado.id())).body(criado);
    }

    @PutMapping("/{id}")
    public ClienteResponseDto atualizar(@PathVariable Long id, @Valid @RequestBody ClienteRequestDto dto) {
        return service.atualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        service.remover(id);
        return ResponseEntity.noContent().build();
    }
}
