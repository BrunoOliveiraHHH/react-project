# Métricas Pessoais — Workflow

> Documento operacional. Como usar a planilha e gerar o relatório mensal,
> minimizando atrito.

---

## Visão geral em 30 segundos

```
TODO TICKET FECHADO              TODO INÍCIO DE MÊS
        │                                 │
        ▼                                 ▼
 Adiciono 1 linha em            Gero relatório a partir
 registro-tarefas.csv           do CSV + envio pra
 (30 segundos)                  gerência/diretoria
```

Sem dashboard, sem ferramenta nova, sem instrumentação. Só CSV + relatório
mensal em markdown.

---

## Os campos da planilha

Arquivo: [`registro-tarefas.csv`](registro-tarefas.csv)

| Coluna              | Quando preencher    | Exemplo                                  |
| ------------------- | ------------------- | ---------------------------------------- |
| `id_teamwork`       | ao receber          | `TW-1234`                                |
| `titulo`            | ao receber          | `Botão de exportar relatório`            |
| `time_solicitante`  | ao receber          | `Time A` / `Squad Pagamentos` / etc.     |
| `tipo`              | ao **fechar**       | `bug` \| `feature-pequena` \| `feature-media` \| `integracao` \| `suporte` \| `refactor` |
| `impacto`           | ao receber          | `P1` \| `P2` \| `P3` (você define)       |
| `data_abertura`     | auto (Teamwork)     | `2026-05-02`                             |
| `data_fechamento`   | ao fechar           | `2026-05-04`                             |
| `horas_trabalhadas` | ao fechar           | `3.5` (do tracking do Teamwork)          |
| `retrabalho`        | ao fechar           | `sim` \| `nao` (voltou de teste com bug?) |
| `destaque`          | ao fechar           | `sim` \| `nao` (vai pro relatório?)      |
| `observacoes`       | quando relevante    | `"Destravou release do time B"`          |

---

## Critérios de classificação

### `tipo` — taxonomia única, fixa

Não invente categorias novas. Mantém o heatmap legível mês a mês.

| Valor             | Definição                                               |
| ----------------- | ------------------------------------------------------- |
| `bug`             | Algo já existia e estava errado.                        |
| `feature-pequena` | Mudança nova, ≤ 4h.                                     |
| `feature-media`   | Mudança nova, > 4h e ≤ 2 dias.                          |
| `integracao`      | Conectar com sistema externo, API, fila, banco.         |
| `suporte`         | Dúvida, ajuda, reset de algo, sem mudança de código.    |
| `refactor`        | Trabalho proativo (balde 2): qualidade, doc, automação. |

> Mais que isso? Vire vários tickets. Tarefa que cabe em 2 categorias = mal recortada.

### `impacto` — você define, não o solicitante

Critério público (cole na descrição do seu canal/Teamwork pra ninguém
discutir):

| Valor | Definição                                                          |
| ----- | ------------------------------------------------------------------ |
| `P1`  | Bloqueia release/cliente/produção. Largo o que estou fazendo.      |
| `P2`  | Atrapalha workflow do time. Esta semana.                           |
| `P3`  | Melhoria/conforto. Quando der.                                     |

Se a maioria dos tickets vira P1, o critério está errado — recalibre.

### `retrabalho` — sinal de qualidade

Marque `sim` se o ticket voltou para você após enviar para teste/validação.
Não conte ajustes pré-aprovação ("falta o ícone X" antes de mandar pra teste).

### `destaque` — alimenta a narrativa

Marque `sim` se o ticket merece aparecer no relatório do mês. Critérios:
- Destravou release/lançamento.
- Resolveu recorrência.
- Risco evitado em produção.
- Atendeu time/cliente novo.

Geralmente 2 a 5 por mês.

---

## Workflow do dia a dia

### Ao receber demanda
1. Cria/recebe ticket no Teamwork.
2. Abre o CSV.
3. Adiciona linha com: `id_teamwork`, `titulo`, `time_solicitante`,
   `impacto`, `data_abertura`. Os outros campos ficam vazios.
4. Trabalha normalmente.

### Ao fechar
1. Conclui no Teamwork.
2. Volta no CSV, completa: `tipo`, `data_fechamento`, `horas_trabalhadas`,
   `retrabalho`, `destaque`, `observacoes`.

**Total: ~30 segundos por ticket.** Se demorar mais, simplifique a
classificação até voltar a ser 30s.

### Hábito sugerido
- Última coisa antes de fechar: atualiza CSV.
- Bloco de 5 minutos no fim do dia para garantir que não ficou pendência.

---

## Gerando o relatório mensal

### Pré-requisitos
Planilha do mês fechada (todos os tickets do mês com classificação
completa).

### Passos (1 hora, no 1º dia útil do mês)

1. **Abre o CSV** no Excel/Google Sheets.
2. **Filtra por mês de fechamento.**
3. **Calcula:**
   - Total de demandas recebidas (linhas com `data_abertura` no mês).
   - Concluídas (linhas com `data_fechamento` no mês).
   - % de conclusão.
   - Horas totais (soma de `horas_trabalhadas`).
   - Lead time médio: média de `data_fechamento - data_abertura` (em dias).
   - Retrabalho: contagem de `retrabalho = sim` ÷ total fechado.
   - Times distintos: contagem única de `time_solicitante`.
4. **Distribuição por tipo**: tabela dinâmica (Pivot) por `tipo`.
5. **Por time**: pivot por `time_solicitante` (qtd + soma de horas).
6. **Destaques**: filtra `destaque = sim`, copia bullets.
7. **Cola tudo** no [`relatorio-mensal-template.md`](relatorio-mensal-template.md),
   substitui placeholders.
8. **Exporta** o markdown como PDF (Pandoc, VSCode, ou copia pro Google
   Docs e exporta).
9. **Envia** pro gerente. Combine com ele se vai chegar até diretoria
   direto, ou se ele consolida.

### Sheets prontas (sugestão)
Se quiser pular cálculos manuais: importa o CSV pro Google Sheets e cria
uma aba `Resumo` com fórmulas:

```
=COUNTIF(Tickets!F:F, ">="&DATE(2026,5,1))                    // recebidos
=COUNTIFS(Tickets!G:G, ">="&DATE(2026,5,1), Tickets!G:G, "<="&DATE(2026,5,31))  // fechados
=SUMIFS(Tickets!H:H, Tickets!G:G, ">="&DATE(2026,5,1), Tickets!G:G, "<="&DATE(2026,5,31))  // horas
=COUNTIFS(Tickets!I:I, "sim", Tickets!G:G, ">="&DATE(2026,5,1)) / N  // retrabalho %
```

E gráficos do Sheets pra distribuição por `tipo` e por `time_solicitante`.

---

## Antes de enviar — checklist

```
[ ] Resumo executivo cabe em 90 segundos de leitura
[ ] Tendência (↑/↓/=) está em CADA indicador comparável com mês anterior
[ ] Pelo menos 1 destaque qualitativo por seção
[ ] Sinais/riscos estão escritos como alerta, não reclamação
[ ] Próximo mês tem foco proativo (balde 2), não só reativo
[ ] Já alinhei com gerente direto antes de enviar pra cima
```

---

## O que NÃO fazer (anti-padrões)

- ❌ Adicionar 15 colunas novas no CSV "pra capturar tudo". Aumenta o atrito,
  você desiste de preencher, métricas viram lixo.
- ❌ Criar dashboard sofisticado antes de 3 meses de dados manuais.
  Você não sabe ainda o que importa medir.
- ❌ Enviar relatório com **só números**. Vira ruído. Sempre conte uma
  história em volta.
- ❌ Inventar números. Se não mediu, escreve "não medido este mês" e
  começa a medir no próximo. Confiança > completude.
- ❌ Esquecer de classificar tickets antigos. Trabalha o backlog na primeira
  semana, depois mantém em dia.

---

## Evolução natural (depois de 3-6 meses de uso)

Quando o CSV virar caro de manter manualmente E você já souber **quais
métricas importam de fato**:

1. **Automatize a extração** via API do Teamwork → Google Sheets.
2. **Looker Studio** (gratuito) conectado ao Sheets — dashboard real,
   esforço baixo.
3. **Relatório passa a citar o link do dashboard** pra quem quer
   se aprofundar; o PDF mensal continua sendo a peça principal.

Não pule essa evolução. Quem dashboard primeiro mede a coisa errada bonito.
