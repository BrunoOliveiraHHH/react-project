package com.loja.erp.produto;

import com.loja.erp.produto.dto.ProdutoFiltroDto;
import org.springframework.data.jpa.domain.Specification;

public final class ProdutoSpecs {

    private ProdutoSpecs() {}

    public static Specification<Produto> comFiltros(ProdutoFiltroDto f) {
        Specification<Produto> spec = Specification.unrestricted();
        if (f == null) return spec;

        if (f.nome() != null && !f.nome().isBlank()) {
            spec = spec.and((r, q, cb) ->
                    cb.like(cb.lower(r.get("nome")), "%" + f.nome().toLowerCase() + "%"));
        }
        if (f.sku() != null && !f.sku().isBlank()) {
            spec = spec.and((r, q, cb) ->
                    cb.like(cb.lower(r.get("sku")), "%" + f.sku().toLowerCase() + "%"));
        }
        if (f.categoriaId() != null) {
            spec = spec.and((r, q, cb) -> cb.equal(r.get("categoria").get("id"), f.categoriaId()));
        }
        if (f.precoMin() != null) {
            spec = spec.and((r, q, cb) -> cb.greaterThanOrEqualTo(r.get("preco"), f.precoMin()));
        }
        if (f.precoMax() != null) {
            spec = spec.and((r, q, cb) -> cb.lessThanOrEqualTo(r.get("preco"), f.precoMax()));
        }
        return spec;
    }
}
