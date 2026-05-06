package com.loja.erp.produto;

import com.loja.erp.produto.dto.ProdutoResponseDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProdutoMapper {

    @Mapping(source = "categoria.id", target = "categoriaId")
    @Mapping(source = "categoria.nome", target = "categoriaNome")
    ProdutoResponseDto paraResposta(Produto entidade);

    List<ProdutoResponseDto> paraRespostas(List<Produto> entidades);
}
