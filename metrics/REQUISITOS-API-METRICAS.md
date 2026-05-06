# Requisitos — API de Métricas Pessoais

> Documento de requisitos para uma API local de registro de demandas e
> geração de relatórios. Projeto pessoal, single-user, single-host.

---

## Nota antes de começar

Aplicando o [TASK-INTAKE.md](../TASK-INTAKE.md):

**Problema real**: não consigo mostrar valor do meu trabalho para gerência
e diretoria. Hoje gasto tempo classificando manualmente em CSV e gerando
relatórios à mão.

**Solução proposta neste doc**: API local em Spring para persistir as
demandas e gerar CSV/PDF mensal automaticamente.

**Por que API e não CSV manual**: motivação. Registrar via formulário web é
mais leve do que abrir planilha; é o suficiente para garantir que você
realmente vá registrar todo dia.

**Critério para parar este projeto**: se em **3 meses** você ainda não
mandou nenhum relatório mensal usando esta API, o problema não era
ferramenta. Volta para CSV.

---

## 1. Contexto

- **Usuário único** (você).
- **Host único** (sua máquina ou container local).
- **Banco**: PostgreSQL local já existente.
- **Stack desejada**: Spring Boot 4 + Java 21 (mesma do projeto ERP, reaproveita
  conhecimento).
- **UI**: HTML estático servido pelo próprio Spring (`src/main/resources/static/`),
  com **Bootstrap 5** (CDN) + **Tabulator** (CDN) + **vanilla JS** consumindo os
  REST endpoints. Sem Thymeleaf, sem build tool, sem framework SPA.

---

## 2. Objetivos (mensuráveis)

| #   | Objetivo                                                              | Como medir                              |
| --- | --------------------------------------------------------------------- | --------------------------------------- |
| O1  | Reduzir tempo de classificação por ticket para ≤ 30s                  | Cronometrar: 10 amostras                |
| O2  | Gerar relatório mensal completo em ≤ 5 minutos                        | Cronometrar dia 1                       |
| O3  | Eliminar erro manual de cálculo (lead time, %, etc.)                  | Conferir 1x com cálculo manual          |
| O4  | Permitir importar histórico do CSV existente sem refazer              | Importação rodando, dados consistentes  |

---

## 3. Personas

### P1 — Eu, durante o expediente
- Tem 30s entre tickets para registrar.
- Quer interface mínima (curl, script, ou tela simples).
- Foco: registrar, sem fricção.

### P2 — Eu, no início do mês
- Tem 1h para gerar e revisar relatório.
- Quer baixar PDF + CSV pronto.
- Foco: dado limpo + número certo + narrativa pra colar.

---

## 4. Requisitos funcionais

### 4.1 Cadastro / atualização de demanda

- **RF-01** Cadastrar demanda com: id Teamwork (string), título, **nome do
  solicitante** (pessoa), time solicitante (equipe), impacto (P1/P2/P3),
  data de abertura.
- **RF-02** Atualizar demanda com: tipo, data de fechamento, horas trabalhadas,
  retrabalho (sim/não), destaque (sim/não), observações.
- **RF-03** Listar demandas com **paginação** e **filtros**:
  - código da tarefa (`id_teamwork`, busca parcial)
  - nome do solicitante (busca parcial)
  - equipe solicitante (busca parcial ou exata)
  - período: data início + data fim (sobre `data_abertura`)
  - opcionalmente: tipo, impacto, retrabalho, destaque (filtros extras
    úteis para o relatório, mas não estritamente exigidos na tela).
- **RF-04** Editar campo individual (correção de classificação).
- **RF-05** Excluir demanda (raro; útil para teste).

### 4.2 Importação

- **RF-06** Importar CSV no formato definido em [`registro-tarefas.csv`](registro-tarefas.csv),
  com validação por linha (linha inválida não interrompe importação;
  retorna lista de erros).
- **RF-07** Importação idempotente por `id_teamwork` — reimporte não duplica,
  só atualiza.

### 4.3 Relatórios

- **RF-08** Gerar relatório mensal (formato JSON) com:
  - Totais: recebidas, concluídas, % conclusão, horas, lead time médio,
    retrabalho %, times distintos.
  - Comparação com mês anterior (delta + tendência).
  - Distribuição por tipo (qtd e %).
  - Distribuição por time (qtd e horas).
  - Lista de destaques (`destaque=sim`).
- **RF-09** Exportar dados via **modal de exportação único** com seleção de:
  - **Formato**: `PDF` ou `CSV`
  - **Período**: `mensal` (escolhe mês/ano) | `diário` (hoje do sistema) |
    `dia específico` (escolhe a data) | `período personalizado` (início + fim)
  - O botão "Exportar" na tela principal apenas abre este modal; ele que
    decide qual endpoint chamar.
- **RF-10** Exportar relatório como **PDF** seguindo o template
  [`relatorio-mensal-template.md`](relatorio-mensal-template.md), com
  números preenchidos.
- **RF-11** Endpoint que devolve gráficos (PNG ou SVG) prontos:
  - Pizza de distribuição por tipo
  - Barras horizontais de demandas por time
  - Linha de throughput (entrou × saiu) dos últimos 6 meses

### 4.4 Configuração

- **RF-12** Catálogo configurável de **tipos** e **impactos** (não fixos no
  código). Permite ajustar a taxonomia sem deploy.
- **RF-13** Catálogo de **times** com normalização (evita "Time A" vs "time-a").

---

## 5. Requisitos não-funcionais

| #     | Requisito                                                                |
| ----- | ------------------------------------------------------------------------ |
| RNF-1 | API responde em ≤ 200ms para operações de CRUD (volume baixo).           |
| RNF-2 | Banco PostgreSQL existente, schema próprio (`metricas`).                 |
| RNF-3 | **Sem autenticação**. Uso pessoal, máquina local, single-user. Não exposto à rede. |
| RNF-4 | Backup do banco semanal (`pg_dump` cron) — dado é insubstituível.        |
| RNF-5 | Rodar local via `mvn spring-boot:run`.                                   |
| RNF-6 | Health check `/actuator/health` opcional.                                |
| RNF-7 | Swagger UI em `/swagger-ui.html` para teste durante desenvolvimento.     |

---

## 6. Modelagem de dados (sugerida)

```
demanda
├── id (PK, BIGSERIAL)
├── id_teamwork (UNIQUE, VARCHAR 40)
├── titulo (VARCHAR 255)
├── nome_solicitante (VARCHAR 120)             -- pessoa que abriu
├── time_id (FK -> time.id)                    -- equipe da pessoa
├── tipo_id (FK -> tipo.id, NULLABLE — define ao fechar)
├── impacto_id (FK -> impacto.id)
├── data_abertura (DATE NOT NULL)
├── data_fechamento (DATE NULLABLE)
├── horas_trabalhadas (NUMERIC(6,2) NULLABLE)
├── retrabalho (BOOLEAN DEFAULT false)
├── destaque (BOOLEAN DEFAULT false)
├── observacoes (TEXT NULLABLE)
└── criado_em / atualizado_em (auditoria)

time
├── id (PK)
├── nome (UNIQUE)
└── slug (normalização)

tipo
├── id (PK)
├── codigo (UNIQUE: bug, feature-pequena, etc.)
└── descricao

impacto
├── id (PK)
├── codigo (UNIQUE: P1, P2, P3)
├── descricao
└── ordem (para sort)
```

**Decisões de design:**
- `tipo` e `impacto` como entidades, não enum, para permitir RF-12 sem deploy.
- `data_fechamento` nullable: ticket aberto em andamento.
- `horas_trabalhadas` em `NUMERIC(6,2)` — 9999.99h cobre uma vida.
- Auditoria simples (criado_em/atualizado_em) — não vale CDC neste contexto.

---

## 7. Endpoints (proposta)

### Demandas
- `POST /api/demandas` — cadastro inicial.
- `GET /api/demandas?codigo=...&solicitante=...&time=...&inicio=2026-05-01&fim=2026-05-31&page=0&size=20`
  — listagem paginada com filtros (todos opcionais; combináveis).
- `GET /api/demandas/{id}` — detalhe.
- `PUT /api/demandas/{id}` — atualizar (fechamento ou correção).
- `PATCH /api/demandas/{id}/fechar` — atalho para fechamento.
- `DELETE /api/demandas/{id}` — exclusão.

Resposta da listagem usa envelope de paginação `PaginaDto<T>` (mesmo
padrão do projeto ERP).

### Importação
- `POST /api/demandas/importar-csv` — upload do CSV existente.

### Catálogo
- `GET /api/tipos` · `POST /api/tipos`
- `GET /api/impactos` · `POST /api/impactos`
- `GET /api/times` · `POST /api/times`

### Relatório / Exportação

Dois "tipos" de saída convivem:

**a) Relatório estruturado mensal (rico, com totais e narrativa):**
- `GET /api/relatorios/mensal?ano=2026&mes=5` — JSON agregado do mês.
- `GET /api/relatorios/mensal/pdf?ano=2026&mes=5` — PDF estruturado.

**b) Exportação por período (listagem tabular, qualquer faixa de datas):**
- `GET /api/exportar/pdf?inicio=2026-05-01&fim=2026-05-01` — PDF tabular.
- `GET /api/exportar/csv?inicio=2026-05-01&fim=2026-05-31` — CSV tabular.
- Ambos aceitam também os filtros da tela: `codigo`, `solicitante`, `time`.

**Mapa do modal → endpoint:**

| Opção do modal       | Formato | Endpoint                                   | Parâmetros                |
| -------------------- | ------- | ------------------------------------------ | ------------------------- |
| Mensal               | PDF     | `/api/relatorios/mensal/pdf`               | `ano`, `mes`              |
| Mensal               | CSV     | `/api/exportar/csv`                        | `inicio` = 1º do mês, `fim` = último do mês |
| Diário (hoje)        | PDF     | `/api/exportar/pdf`                        | `inicio` = `fim` = hoje   |
| Diário (hoje)        | CSV     | `/api/exportar/csv`                        | `inicio` = `fim` = hoje   |
| Dia específico       | PDF     | `/api/exportar/pdf`                        | `inicio` = `fim` = data escolhida |
| Dia específico       | CSV     | `/api/exportar/csv`                        | `inicio` = `fim` = data escolhida |
| Período personalizado| PDF     | `/api/exportar/pdf`                        | `inicio`, `fim`           |
| Período personalizado| CSV     | `/api/exportar/csv`                        | `inicio`, `fim`           |

---

## 8. UI estática + geração de PDF

### UI da aplicação (`src/main/resources/static/`)

Single-page **sem framework**, apenas:

- `index.html` — layout único com:
  - **Bloco superior**: formulário de cadastro/edição (campos da demanda +
    botão Salvar + botão Limpar).
  - **Bloco de filtros**: código da tarefa, nome do solicitante, equipe,
    período (data início + data fim) + botões "Filtrar" e "Limpar filtros".
  - **Botão "Exportar"** que abre um **modal único** com:
    - radio do **formato**: PDF / CSV
    - radio do **período**: Mensal | Diário (hoje) | Dia específico | Período
    - campos contextuais (mês/ano, data, datas inicio/fim) habilitam
      conforme a opção escolhida
    - botão "Baixar" que dispara o download.
  - **Datatable** com paginação no rodapé, listando os registros filtrados.
  - **Modal de edição** que abre ao clicar numa linha.
- `app.js` — vanilla JavaScript com `fetch()` para chamar `/api/...`.
- `app.css` — estilos próprios (mínimos; Bootstrap cobre o resto).

### Bibliotecas via CDN (sem build, sem npm)

- **Bootstrap 5** — layout, formulários, modais, botões, alerts.
- **Tabulator** — datatable com paginação, sort, filtros opcionais por coluna.
- **Sem jQuery, sem React, sem build tool.** `<script src="...cdn..."></script>`.

### PDF mensal

Em vez de Thymeleaf, usar uma das opções leves:

1. **Mustache + Flying Saucer** — Mustache (Spring Boot tem starter) renderiza
   HTML, Flying Saucer converte para PDF. Recomendado.
2. **OpenPDF / iText 7** — programático. Mais código, mais controle, sem template.
3. **Construir HTML manualmente em Java** (`String.format` + `StringBuilder`)
   e passar pra Flying Saucer. Funciona, mas vira gambiarra rápido.

**Recomendação**: opção 1 (Mustache + Flying Saucer). Mantém template separado
do código, sem trazer Thymeleaf inteiro só para PDF.

---

## 9. Não-funcionais resolvidos pela stack

Reaproveitar do projeto ERP:
- Spring Boot 4 + Java 21
- Bean Validation (`@Valid`)
- ProblemDetail (RFC 7807) para erros
- MapStruct para DTO ↔ Entity
- Lombok
- Swagger/OpenAPI
- Testcontainers para teste com banco real
- Spec/Filter pattern para listagem com filtros

---

## 10. Fora de escopo (explícito)

Coisas que **não** vão no MVP, e isso é decisão consciente:

- ❌ Multi-usuário, autenticação social, RBAC.
- ❌ Multi-tenant.
- ❌ Frontend dedicado (use curl/Postman/Swagger UI no MVP).
- ❌ Notificações, e-mail, lembretes.
- ❌ Integração ativa com Teamwork (puxar tickets da API deles).
- ❌ Dashboard em tempo real / WebSocket / SSE.
- ❌ Mobile app.
- ❌ Análise preditiva, ML, sugestão de classificação automática.
- ❌ Versionamento de relatório (histórico de PDFs gerados).

Se algum destes virar essencial, vira ticket separado **depois** do MVP em uso.

---

## 11. Premissas

- Volume **baixo**: ~30-100 demandas/mês. Sem necessidade de paginação cara,
  cache, índices sofisticados.
- Você é o único usuário. Nada de simultaneidade ou lock.
- Banco roda local; se cair, só você é afetado.
- Backup é responsabilidade sua (cron + `pg_dump`).
- Layout do PDF segue o markdown atual; mudanças de design são iteração futura.

---

## 12. Riscos

| Risco                                      | Mitigação                                                  |
| ------------------------------------------ | ---------------------------------------------------------- |
| Construir e nunca usar (procrastinação)    | Critério explícito de parada (seção "Nota antes de começar")|
| Schema rígido demais cedo                  | Catálogos como entidades (RF-12, RF-13)                    |
| PDF feio o suficiente para não enviar       | Template HTML/CSS, iterar 2-3 vezes antes de "fim"         |
| Retrabalho ao migrar do CSV                | Importador idempotente desde MVP (RF-06, RF-07)            |
| Bug factor alto — sou o único              | Backup automatizado + repo git para o código + dados em PG |

---

## 13. Roadmap em fases (incremental)

### Fase 0 — Pré-código (1-2h)
- Setup do projeto (Maven, Spring Boot, deps).
- Banco + Flyway com migrations iniciais.
- Smoke test: API sobe, Swagger acessível.

### Fase 1 — Backend mínimo
- CRUD de demandas + catálogos (tipo, impacto, time).
- Listagem com filtros e paginação (`/api/demandas` com filtros da tela).
- Importação do CSV existente (`/api/demandas/importar-csv`).
- Critério: dá pra registrar/editar/listar via Swagger.

### Fase 2 — UI estática
- `index.html` com formulário + filtros + datatable (Tabulator) + modal
  de edição.
- `app.js` chamando os endpoints da Fase 1.
- Critério: você consegue cadastrar e editar **sem** abrir Swagger.

### Fase 3 — Exportação CSV
- Modal de exportação (com as 4 opções de período).
- Endpoint `/api/exportar/csv`.
- Critério: baixa CSV em todos os 4 modos.

### Fase 4 — Exportação PDF
- Endpoint `/api/exportar/pdf` (tabular, mesmo template para diário/dia/período).
- Endpoint `/api/relatorios/mensal/pdf` (template estruturado, com totais).
- Mustache + Flying Saucer.
- Critério: baixa PDF mensal estruturado e PDF tabular nos demais modos.

### Fase 5 — Polimento (opcional)
- Gráficos no PDF mensal.
- Backup automatizado.
- Atalhos de teclado na UI.

**Stop em qualquer fase é entrega válida.** Fase 1 + 2 já substitui o CSV
manual.

---

## 14. Critério de aceite por fase (DoD)

### Fase 1 (Backend)
- [ ] `POST /api/demandas` cria registro válido.
- [ ] `GET /api/demandas?codigo=&solicitante=&time=&inicio=&fim=&page=&size=`
      filtra e pagina corretamente.
- [ ] `POST /api/demandas/importar-csv` importa sem erro o CSV existente.
- [ ] Validação retorna `ProblemDetail` (RFC 7807).
- [ ] Swagger documenta todos os endpoints.

### Fase 2 (UI estática)
- [ ] Formulário cadastra/edita demanda chamando a API.
- [ ] Datatable lista os registros com paginação.
- [ ] Filtros (código, solicitante, time, período) refletem na lista.
- [ ] Modal de edição abre/fecha e salva.

### Fase 4 (PDF)
- [ ] PDF mensal estruturado bate visualmente com o template markdown.
- [ ] PDF tabular (período/dia) é legível e imprimível.
- [ ] Tempo de geração ≤ 5 segundos.

### Critério global de "pronto pra usar de verdade"
- [ ] Você usou em produção (própria) por **2 meses seguidos**.
- [ ] Mandou 2 relatórios reais via PDF gerado pela API.
- [ ] Nenhum dado precisou ser corrigido manualmente.

---

## 15. Métricas para o próprio projeto

Como saber se a API valeu a pena (depois de 6 meses):

- Tempo gasto/mês para gerar relatório: caiu de N minutos para M.
- Quantos meses você efetivamente mandou relatório: ≥ 5 de 6 = sucesso.
- Quantas vezes a API caiu/quebrou e atrapalhou: ≤ 1.
- Você acabou criando um frontend (sinal de sucesso) ou desistiu (sinal de
  que era CSV manual mesmo).

---

## 16. Estrutura sugerida do repositório

```
metricas-api/
├── pom.xml
├── README.md                 # como rodar
├── src/main/java/com/bruno/metricas/
│   ├── MetricasApplication.java
│   ├── config/               # OpenApiConfig, CorsConfig (sem Security)
│   ├── common/               # PaginaDto, GlobalExceptionHandler
│   ├── catalogo/             # Tipo, Impacto, Time
│   ├── demanda/              # Demanda + Repository + Specs + Service + Controller + Mapper + DTOs
│   ├── importacao/           # CSV importer
│   ├── exportacao/           # CsvExporter + PdfExporter (tabular)
│   └── relatorio/            # ReportService + PdfMensal (estruturado, Mustache)
└── src/main/resources/
    ├── application.yml
    ├── db/migration/         # Flyway
    ├── static/               # index.html, app.js, app.css (UI servida pelo Spring)
    └── templates/            # mustache templates do PDF mensal
```

---

## Resumo executivo (para você mesmo, no futuro)

- Você está construindo isto **principalmente para praticar Spring** e
  secundariamente para automatizar relatório.
- O CSV manual continua sendo o caminho **honesto** durante a construção.
- Fase 1 entrega valor; pare ali se a vida ficar corrida.
- Se daqui a 3 meses esta API estiver feita mas você nunca mandou
  relatório, o problema **nunca foi ferramenta**.

Bom código.
