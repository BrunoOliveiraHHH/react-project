package com.loja.erp.cliente;

import com.loja.erp.cliente.dto.ClienteFiltroDto;
import org.springframework.data.jpa.domain.Specification;

public final class ClienteSpecs {

    private ClienteSpecs() {}

    public static Specification<Cliente> comFiltros(ClienteFiltroDto f) {
        Specification<Cliente> spec = Specification.unrestricted();
        if (f == null) return spec;

        if (f.nome() != null && !f.nome().isBlank()) {
            spec = spec.and((r, q, cb) ->
                    cb.like(cb.lower(r.get("nome")), "%" + f.nome().toLowerCase() + "%"));
        }
        if (f.cpf() != null && !f.cpf().isBlank()) {
            spec = spec.and((r, q, cb) -> cb.like(r.get("cpf"), "%" + f.cpf() + "%"));
        }
        if (f.email() != null && !f.email().isBlank()) {
            spec = spec.and((r, q, cb) ->
                    cb.like(cb.lower(r.get("email")), "%" + f.email().toLowerCase() + "%"));
        }
        return spec;
    }
}
