package com.loja.erp.categoria;

import com.loja.erp.categoria.dto.CategoriaFiltroDto;
import org.springframework.data.jpa.domain.Specification;

/**
 * Specifications dinâmicas para Categoria. Compõe filtros opcionais via AND.
 */
public final class CategoriaSpecs {

    private CategoriaSpecs() {}

    public static Specification<Categoria> comFiltros(CategoriaFiltroDto filtro) {
        Specification<Categoria> spec = Specification.unrestricted();
        if (filtro == null) return spec;

        if (filtro.nome() != null && !filtro.nome().isBlank()) {
            spec = spec.and((root, q, cb) ->
                    cb.like(cb.lower(root.get("nome")), "%" + filtro.nome().toLowerCase() + "%"));
        }
        if (filtro.descricao() != null && !filtro.descricao().isBlank()) {
            spec = spec.and((root, q, cb) ->
                    cb.like(cb.lower(root.get("descricao")), "%" + filtro.descricao().toLowerCase() + "%"));
        }
        return spec;
    }
}
