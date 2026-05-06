package com.loja.erp.categoria;

import com.loja.erp.categoria.dto.CategoriaRequestDto;
import com.loja.erp.categoria.dto.CategoriaResponseDto;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CategoriaMapper {
    Categoria paraEntidade(CategoriaRequestDto dto);
    CategoriaResponseDto paraResposta(Categoria entidade);
    List<CategoriaResponseDto> paraRespostas(List<Categoria> entidades);
    void atualizar(CategoriaRequestDto dto, @MappingTarget Categoria entidade);
}
