package com.loja.erp.produto;

import com.loja.erp.categoria.Categoria;
import com.loja.erp.categoria.CategoriaRepository;
import com.loja.erp.common.PaginaDto;
import com.loja.erp.exception.RecursoNaoEncontradoException;
import com.loja.erp.produto.dto.ProdutoFiltroDto;
import com.loja.erp.produto.dto.ProdutoRequestDto;
import com.loja.erp.produto.dto.ProdutoResponseDto;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ProdutoService {

    private final ProdutoRepository repository;
    private final CategoriaRepository categoriaRepository;
    private final ProdutoMapper mapper;

    public ProdutoService(ProdutoRepository repository,
                          CategoriaRepository categoriaRepository,
                          ProdutoMapper mapper) {
        this.repository = repository;
        this.categoriaRepository = categoriaRepository;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<ProdutoResponseDto> listarTodos() {
        return mapper.paraRespostas(repository.findAll());
    }

    @Transactional(readOnly = true)
    public PaginaDto<ProdutoResponseDto> listarPaginado(ProdutoFiltroDto filtro, Pageable pageable) {
        return PaginaDto.de(
                repository.findAll(ProdutoSpecs.comFiltros(filtro), pageable)
                        .map(mapper::paraResposta)
        );
    }

    @Transactional(readOnly = true)
    public ProdutoResponseDto buscarPorId(Long id) {
        return mapper.paraResposta(buscarEntidade(id));
    }

    public ProdutoResponseDto cadastrar(ProdutoRequestDto dto) {
        Categoria categoria = buscarCategoria(dto.categoriaId());
        Produto entidade = Produto.builder()
                .nome(dto.nome())
                .sku(dto.sku())
                .preco(dto.preco())
                .estoque(dto.estoque())
                .categoria(categoria)
                .build();
        return mapper.paraResposta(repository.save(entidade));
    }

    public ProdutoResponseDto atualizar(Long id, ProdutoRequestDto dto) {
        Produto entidade = buscarEntidade(id);
        Categoria categoria = buscarCategoria(dto.categoriaId());
        entidade.setNome(dto.nome());
        entidade.setSku(dto.sku());
        entidade.setPreco(dto.preco());
        entidade.setEstoque(dto.estoque());
        entidade.setCategoria(categoria);
        return mapper.paraResposta(repository.save(entidade));
    }

    public void remover(Long id) {
        repository.delete(buscarEntidade(id));
    }

    private Produto buscarEntidade(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> RecursoNaoEncontradoException.paraId("Produto", id));
    }

    private Categoria buscarCategoria(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> RecursoNaoEncontradoException.paraId("Categoria", id));
    }
}
