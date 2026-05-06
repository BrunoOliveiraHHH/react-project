-- =============================================================================
-- V1 — Schema inicial do ERP da Loja
-- PostgreSQL 18
-- =============================================================================
-- Convenção: nomes de tabelas e colunas em PT-BR.
-- Esta migration é a fonte da verdade do schema; o Hibernate apenas valida.
-- =============================================================================

CREATE TABLE usuario (
    id          BIGSERIAL PRIMARY KEY,
    username    VARCHAR(60)  NOT NULL UNIQUE,
    senha       VARCHAR(120) NOT NULL,
    role        VARCHAR(20)  NOT NULL,
    ativo       BOOLEAN      NOT NULL DEFAULT TRUE,
    criado_em   TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE categoria (
    id        BIGSERIAL PRIMARY KEY,
    nome      VARCHAR(80)  NOT NULL UNIQUE,
    descricao VARCHAR(255)
);

CREATE TABLE produto (
    id            BIGSERIAL PRIMARY KEY,
    nome          VARCHAR(120)   NOT NULL,
    sku           VARCHAR(40)    NOT NULL UNIQUE,
    preco         NUMERIC(12, 2) NOT NULL,
    estoque       INTEGER        NOT NULL DEFAULT 0,
    categoria_id  BIGINT         NOT NULL REFERENCES categoria (id)
);

CREATE TABLE cliente (
    id        BIGSERIAL PRIMARY KEY,
    nome      VARCHAR(120) NOT NULL,
    cpf       VARCHAR(14)  NOT NULL UNIQUE,
    email     VARCHAR(120),
    telefone  VARCHAR(20)
);

CREATE TABLE venda (
    id            BIGSERIAL PRIMARY KEY,
    cliente_id    BIGINT         NOT NULL REFERENCES cliente (id),
    produto_id    BIGINT         NOT NULL REFERENCES produto (id),
    quantidade    INTEGER        NOT NULL,
    valor_total   NUMERIC(12, 2) NOT NULL,
    data_venda    TIMESTAMP      NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_produto_categoria ON produto (categoria_id);
CREATE INDEX idx_venda_cliente     ON venda (cliente_id);
CREATE INDEX idx_venda_produto     ON venda (produto_id);
CREATE INDEX idx_venda_data        ON venda (data_venda);
