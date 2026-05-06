package com.loja.erp.venda;

import com.loja.erp.cliente.Cliente;
import com.loja.erp.cliente.ClienteRepository;
import com.loja.erp.common.PaginaDto;
import com.loja.erp.exception.RecursoNaoEncontradoException;
import com.loja.erp.produto.Produto;
import com.loja.erp.produto.ProdutoRepository;
import com.loja.erp.venda.dto.VendaFiltroDto;
import com.loja.erp.venda.dto.VendaRequestDto;
import com.loja.erp.venda.dto.VendaResponseDto;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@Transactional
public class VendaService {

    private final VendaRepository repository;
    private final ClienteRepository clienteRepository;
    private final ProdutoRepository produtoRepository;
    private final VendaMapper mapper;

    public VendaService(VendaRepository repository,
                        ClienteRepository clienteRepository,
                        ProdutoRepository produtoRepository,
                        VendaMapper mapper) {
        this.repository = repository;
        this.clienteRepository = clienteRepository;
        this.produtoRepository = produtoRepository;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public PaginaDto<VendaResponseDto> listarPaginado(VendaFiltroDto filtro, Pageable pageable) {
        return PaginaDto.de(
                repository.findAll(VendaSpecs.comFiltros(filtro), pageable)
                        .map(mapper::paraResposta)
        );
    }

    @Transactional(readOnly = true)
    public VendaResponseDto buscarPorId(Long id) {
        return mapper.paraResposta(buscarEntidade(id));
    }

    public VendaResponseDto cadastrar(VendaRequestDto dto) {
        Cliente cliente = clienteRepository.findById(dto.clienteId())
                .orElseThrow(() -> RecursoNaoEncontradoException.paraId("Cliente", dto.clienteId()));
        Produto produto = produtoRepository.findById(dto.produtoId())
                .orElseThrow(() -> RecursoNaoEncontradoException.paraId("Produto", dto.produtoId()));

        if (produto.getEstoque() < dto.quantidade()) {
            throw new IllegalArgumentException("Estoque insuficiente para o produto " + produto.getNome());
        }
        produto.setEstoque(produto.getEstoque() - dto.quantidade());
        produtoRepository.save(produto);

        BigDecimal valorTotal = produto.getPreco().multiply(BigDecimal.valueOf(dto.quantidade()));

        Venda venda = Venda.builder()
                .cliente(cliente)
                .produto(produto)
                .quantidade(dto.quantidade())
                .valorTotal(valorTotal)
                .dataVenda(LocalDateTime.now())
                .build();

        return mapper.paraResposta(repository.save(venda));
    }

    public void remover(Long id) {
        repository.delete(buscarEntidade(id));
    }

    private Venda buscarEntidade(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> RecursoNaoEncontradoException.paraId("Venda", id));
    }
}
