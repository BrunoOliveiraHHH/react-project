-- =============================================================================
-- DDL PostgreSQL 18 — ERP da Loja
-- =============================================================================
-- Este arquivo é uma REFERÊNCIA do esquema que o Hibernate cria automaticamente
-- via ddl-auto=update. Você pode rodá-lo manualmente em um banco vazio caso
-- prefira controlar o schema sem o Hibernate (defina ddl-auto=validate).
--
-- Convenção: nomes de tabelas e colunas em PT-BR (domínio em português).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Tabela: usuario
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuario (
    id          BIGSERIAL PRIMARY KEY,
    username    VARCHAR(60)  NOT NULL UNIQUE,
    senha       VARCHAR(120) NOT NULL,
    role        VARCHAR(20)  NOT NULL,
    ativo       BOOLEAN      NOT NULL DEFAULT TRUE,
    criado_em   TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- Tabela: categoria
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categoria (
    id        BIGSERIAL PRIMARY KEY,
    nome      VARCHAR(80)  NOT NULL UNIQUE,
    descricao VARCHAR(255)
);

-- -----------------------------------------------------------------------------
-- Tabela: produto
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS produto (
    id            BIGSERIAL PRIMARY KEY,
    nome          VARCHAR(120)   NOT NULL,
    sku           VARCHAR(40)    NOT NULL UNIQUE,
    preco         NUMERIC(12, 2) NOT NULL,
    estoque       INTEGER        NOT NULL DEFAULT 0,
    categoria_id  BIGINT         NOT NULL REFERENCES categoria (id)
);

-- -----------------------------------------------------------------------------
-- Tabela: cliente
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cliente (
    id        BIGSERIAL PRIMARY KEY,
    nome      VARCHAR(120) NOT NULL,
    cpf       VARCHAR(14)  NOT NULL UNIQUE,
    email     VARCHAR(120),
    telefone  VARCHAR(20)
);

-- -----------------------------------------------------------------------------
-- Tabela: venda
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS venda (
    id            BIGSERIAL PRIMARY KEY,
    cliente_id    BIGINT         NOT NULL REFERENCES cliente (id),
    produto_id    BIGINT         NOT NULL REFERENCES produto (id),
    quantidade    INTEGER        NOT NULL,
    valor_total   NUMERIC(12, 2) NOT NULL,
    data_venda    TIMESTAMP      NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- Índices auxiliares
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_produto_categoria ON produto (categoria_id);
CREATE INDEX IF NOT EXISTS idx_venda_cliente     ON venda (cliente_id);
CREATE INDEX IF NOT EXISTS idx_venda_produto     ON venda (produto_id);
CREATE INDEX IF NOT EXISTS idx_venda_data        ON venda (data_venda);
