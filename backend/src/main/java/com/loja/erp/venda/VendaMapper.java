package com.loja.erp.venda;

import com.loja.erp.venda.dto.VendaResponseDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface VendaMapper {

    @Mapping(source = "cliente.id", target = "clienteId")
    @Mapping(source = "cliente.nome", target = "clienteNome")
    @Mapping(source = "produto.id", target = "produtoId")
    @Mapping(source = "produto.nome", target = "produtoNome")
    VendaResponseDto paraResposta(Venda entidade);

    List<VendaResponseDto> paraRespostas(List<Venda> entidades);
}
