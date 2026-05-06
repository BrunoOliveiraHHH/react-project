package com.loja.erp.categoria;

import com.loja.erp.categoria.dto.CategoriaFiltroDto;
import com.loja.erp.categoria.dto.CategoriaRequestDto;
import com.loja.erp.categoria.dto.CategoriaResponseDto;
import com.loja.erp.common.PaginaDto;
import com.loja.erp.exception.RecursoNaoEncontradoException;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CategoriaService {

    private final CategoriaRepository repository;
    private final CategoriaMapper mapper;

    public CategoriaService(CategoriaRepository repository, CategoriaMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<CategoriaResponseDto> listarTodas() {
        return mapper.paraRespostas(repository.findAll());
    }

    @Transactional(readOnly = true)
    public PaginaDto<CategoriaResponseDto> listarPaginado(CategoriaFiltroDto filtro, Pageable pageable) {
        return PaginaDto.de(
                repository.findAll(CategoriaSpecs.comFiltros(filtro), pageable)
                        .map(mapper::paraResposta)
        );
    }

    @Transactional(readOnly = true)
    public CategoriaResponseDto buscarPorId(Long id) {
        return mapper.paraResposta(buscarEntidade(id));
    }

    public CategoriaResponseDto cadastrar(CategoriaRequestDto dto) {
        Categoria entidade = mapper.paraEntidade(dto);
        return mapper.paraResposta(repository.save(entidade));
    }

    public CategoriaResponseDto atualizar(Long id, CategoriaRequestDto dto) {
        Categoria entidade = buscarEntidade(id);
        mapper.atualizar(dto, entidade);
        return mapper.paraResposta(repository.save(entidade));
    }

    public void remover(Long id) {
        Categoria entidade = buscarEntidade(id);
        repository.delete(entidade);
    }

    private Categoria buscarEntidade(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> RecursoNaoEncontradoException.paraId("Categoria", id));
    }
}
