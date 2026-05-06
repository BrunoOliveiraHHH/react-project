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

**Solução alternativa que NÃO foi escolhida**: continuar com CSV manual +
Sheets + Pandoc. É **mais barato** e resolve o problema. Esta API só vale
se houver intenção paralela de **praticar Spring** e/ou **acumular tempo
poupado** depois de algumas iterações. Se isso não for verdade, releia o
[ON-DEMAND.md](../ON-DEMAND.md): você está procrastinando trabalho real
com codificação confortável.

**Critério para parar este projeto**: se em **3 meses** você ainda não
mandou nenhum relatório mensal usando esta API (mesmo que a API esteja
pronta), o problema não era ferramenta. Volta para CSV.

---

## 1. Contexto

- **Usuário único** (você).
- **Host único** (sua máquina ou container local).
- **Banco**: PostgreSQL local já existente.
- **Stack desejada**: Spring Boot 4 + Java 21 (mesma do projeto ERP, reaproveita
  conhecimento).
- **Frontend**: opcional. MVP pode ser só API + scripts/curl. Depois pode ganhar
  UI React reaproveitando padrões do `react-project/frontend`.

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

- **RF-01** Cadastrar demanda com: id Teamwork (string), título, time
  solicitante, impacto (P1/P2/P3), data de abertura.
- **RF-02** Atualizar demanda com: tipo, data de fechamento, horas trabalhadas,
  retrabalho (sim/não), destaque (sim/não), observações.
- **RF-03** Listar demandas com filtros: período, time, tipo, impacto,
  retrabalho, destaque.
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
- **RF-09** Exportar relatório como **CSV** (uma linha por demanda do mês).
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
| RNF-3 | Autenticação básica (API token simples ou Spring Security com user único). Não tem usuário externo. |
| RNF-4 | Logs estruturados, mas sem PII (nem precisa, é dado seu).                |
| RNF-5 | Backup do banco semanal (`pg_dump` cron) — dado é insubstituível.        |
| RNF-6 | Rodar local via `mvn spring-boot:run` ou `docker compose up`.            |
| RNF-7 | Health check `/actuator/health` para auto-monitoramento.                 |
| RNF-8 | Swagger UI em `/swagger-ui.html` (boa prática + você já usa).            |

---

## 6. Modelagem de dados (sugerida)

```
demanda
├── id (PK, BIGSERIAL)
├── id_teamwork (UNIQUE, VARCHAR 40)
├── titulo (VARCHAR 255)
├── time_id (FK -> time.id)
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
- `GET /api/demandas?inicio=2026-05-01&fim=2026-05-31&time=A&tipo=bug` — listagem com filtros.
- `GET /api/demandas/{id}` — detalhe.
- `PUT /api/demandas/{id}` — atualizar (fechamento ou correção).
- `PATCH /api/demandas/{id}/fechar` — atalho para fechamento, recebe só os
  campos do encerramento.
- `DELETE /api/demandas/{id}` — exclusão.

### Importação
- `POST /api/demandas/importar-csv` — upload do CSV existente.

### Catálogo
- `GET /api/tipos` · `POST /api/tipos`
- `GET /api/impactos` · `POST /api/impactos`
- `GET /api/times` · `POST /api/times`

### Relatório
- `GET /api/relatorios/mensal?ano=2026&mes=5` — JSON.
- `GET /api/relatorios/mensal/csv?ano=2026&mes=5` — CSV download.
- `GET /api/relatorios/mensal/pdf?ano=2026&mes=5` — PDF download.
- `GET /api/relatorios/throughput?meses=6` — série temporal.

---

## 8. Geração de PDF — abordagem

Avaliar (em ordem de simplicidade):

1. **OpenPDF / iText 7** — gerar PDF programaticamente. Mais código, mais controle.
2. **Thymeleaf + Flying Saucer / Open HTML to PDF** — renderiza HTML → PDF.
   Mais natural para layout tipo relatório.
3. **JasperReports** — overkill aqui. Pular.

**Recomendação**: opção 2 (Flying Saucer). Você já mexe com templates;
HTML/CSS é mais flexível que API gráfica.

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

### Fase 1 — MVP usável (escopo mínimo) — ~2-3 dias úteis
- CRUD básico de demandas + catálogos.
- Importação do CSV existente.
- Relatório mensal em **JSON** (sem PDF ainda).
- Critério de aceite: registrar demanda nova via Swagger, listar, e gerar
  JSON do mês.

### Fase 2 — CSV de saída — ~0.5 dia
- Endpoint que exporta o mês como CSV.

### Fase 3 — PDF — ~1-2 dias
- Template HTML do relatório.
- Geração do PDF preenchido.
- Layout aprovado (você mesmo aprova).

### Fase 4 — Gráficos — ~0.5-1 dia
- Geração de PNG/SVG dos 3 gráficos.
- Embutidos no PDF.

### Fase 5 — UI (opcional, futuro) — ~3-5 dias
- Reaproveitar padrões do `react-project/frontend`.
- Telas: lista, cadastro rápido, fechamento rápido, relatório.

**Stop em qualquer fase é entrega válida.** A Fase 1 + 2 já é melhor que
nada. Não precisa terminar tudo para começar a usar.

---

## 14. Critério de aceite por fase (DoD)

### Fase 1 (MVP)
- [ ] `POST /api/demandas` cria registro válido.
- [ ] `GET /api/demandas` filtra por mês.
- [ ] `POST /api/demandas/importar-csv` importa o CSV existente sem erro.
- [ ] `GET /api/relatorios/mensal` devolve JSON com todos os números do mês.
- [ ] Validação retorna `ProblemDetail` (RFC 7807).
- [ ] Swagger documenta todos os endpoints.

### Fase 3 (PDF)
- [ ] PDF gerado bate visualmente com o template markdown.
- [ ] Você consegue mandar pro gerente sem retrabalho.
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
│   ├── config/               # SecurityConfig, OpenApiConfig
│   ├── common/               # PaginaDto, exceptions
│   ├── catalogo/             # Tipo, Impacto, Time (entidade + service + controller)
│   ├── demanda/              # core: Demanda + Repository + Specs + Service + Controller + Mapper + DTOs
│   ├── importacao/           # CSV importer
│   └── relatorio/            # ReportService + PdfRenderer + CsvExporter + ChartGenerator
└── src/main/resources/
    ├── application.yml
    ├── db/migration/         # Flyway
    └── templates/            # relatorio.html (Thymeleaf)
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
