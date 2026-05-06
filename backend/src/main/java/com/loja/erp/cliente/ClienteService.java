package com.loja.erp.cliente;

import com.loja.erp.cliente.dto.ClienteFiltroDto;
import com.loja.erp.cliente.dto.ClienteRequestDto;
import com.loja.erp.cliente.dto.ClienteResponseDto;
import com.loja.erp.common.PaginaDto;
import com.loja.erp.exception.RecursoNaoEncontradoException;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ClienteService {

    private final ClienteRepository repository;
    private final ClienteMapper mapper;

    public ClienteService(ClienteRepository repository, ClienteMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public PaginaDto<ClienteResponseDto> listarPaginado(ClienteFiltroDto filtro, Pageable pageable) {
        return PaginaDto.de(
                repository.findAll(ClienteSpecs.comFiltros(filtro), pageable)
                        .map(mapper::paraResposta)
        );
    }

    @Transactional(readOnly = true)
    public List<ClienteResponseDto> listarTodos() {
        return mapper.paraRespostas(repository.findAll());
    }

    @Transactional(readOnly = true)
    public ClienteResponseDto buscarPorId(Long id) {
        return mapper.paraResposta(buscarEntidade(id));
    }

    public ClienteResponseDto cadastrar(ClienteRequestDto dto) {
        return mapper.paraResposta(repository.save(mapper.paraEntidade(dto)));
    }

    public ClienteResponseDto atualizar(Long id, ClienteRequestDto dto) {
        Cliente entidade = buscarEntidade(id);
        mapper.atualizar(dto, entidade);
        return mapper.paraResposta(repository.save(entidade));
    }

    public void remover(Long id) {
        repository.delete(buscarEntidade(id));
    }

    private Cliente buscarEntidade(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> RecursoNaoEncontradoException.paraId("Cliente", id));
    }
}
