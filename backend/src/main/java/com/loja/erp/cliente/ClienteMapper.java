package com.loja.erp.cliente;

import com.loja.erp.cliente.dto.ClienteRequestDto;
import com.loja.erp.cliente.dto.ClienteResponseDto;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ClienteMapper {
    Cliente paraEntidade(ClienteRequestDto dto);
    ClienteResponseDto paraResposta(Cliente entidade);
    List<ClienteResponseDto> paraRespostas(List<Cliente> entidades);
    void atualizar(ClienteRequestDto dto, @MappingTarget Cliente entidade);
}
