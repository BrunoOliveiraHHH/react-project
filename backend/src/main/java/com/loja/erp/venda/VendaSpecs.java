package com.loja.erp.venda;

import com.loja.erp.venda.dto.VendaFiltroDto;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalTime;

public final class VendaSpecs {

    private VendaSpecs() {}

    public static Specification<Venda> comFiltros(VendaFiltroDto f) {
        Specification<Venda> spec = Specification.unrestricted();
        if (f == null) return spec;

        if (f.clienteId() != null) {
            spec = spec.and((r, q, cb) -> cb.equal(r.get("cliente").get("id"), f.clienteId()));
        }
        if (f.produtoId() != null) {
            spec = spec.and((r, q, cb) -> cb.equal(r.get("produto").get("id"), f.produtoId()));
        }
        if (f.dataInicio() != null) {
            spec = spec.and((r, q, cb) ->
                    cb.greaterThanOrEqualTo(r.get("dataVenda"), f.dataInicio().atStartOfDay()));
        }
        if (f.dataFim() != null) {
            spec = spec.and((r, q, cb) ->
                    cb.lessThanOrEqualTo(r.get("dataVenda"), f.dataFim().atTime(LocalTime.MAX)));
        }
        return spec;
    }
}
