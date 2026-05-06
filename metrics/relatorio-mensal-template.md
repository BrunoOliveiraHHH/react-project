# Relatório Mensal — [Mês/Ano]

> Responsável: [Seu nome] · Período: [01/MM/AAAA → último dia útil] ·
> Audiência: gerência e diretoria

---

## Resumo executivo

> *Parágrafo único, 3-5 linhas. O leitor com 90 segundos lê só isto.*

Em **[mês]**, foram recebidas **N** demandas de **K** times de engenharia,
das quais **M concluí** (P% de conclusão), com **R% de retrabalho**.
Foram investidas **H horas** no atendimento. Maior destaque: **[1 frase
sobre o entregável que mais movimentou o ponteiro]**.

---

## Números do mês

| Indicador                          | Valor       | Mês anterior | Tendência |
| ---------------------------------- | ----------- | ------------ | --------- |
| Demandas recebidas                 |  N          |  N-1         | ↑ / ↓ / = |
| Demandas concluídas                |  M          |  M-1         | ↑ / ↓ / = |
| % de conclusão (M / N)             |  P %        |  P-1 %       | ↑ / ↓ / = |
| Horas trabalhadas                  |  H          |  H-1         | ↑ / ↓ / = |
| Lead time médio (dias)             |  L          |  L-1         | ↑ / ↓ / = |
| Retrabalho (% de tickets reabertos)|  R %        |  R-1 %       | ↑ / ↓ / = |
| Times-cliente atendidos            |  K          |  K-1         | ↑ / ↓ / = |

---

## Distribuição por tipo de demanda

> *Insira gráfico de barras horizontal — exporta direto do Sheets/Excel.*

| Tipo               | Qtd | % do total |
| ------------------ | --- | ---------- |
| feature-pequena    |  X  |  X %       |
| feature-media      |  X  |  X %       |
| bug                |  X  |  X %       |
| integração         |  X  |  X %       |
| suporte / dúvida   |  X  |  X %       |
| refactor / melhoria|  X  |  X %       |

**Leitura**: *[1-2 linhas sobre o que essa distribuição diz. Ex.: "60% do
mês foi feature pequena — ritmo previsível. Bug subiu de 15% pra 25% por
causa do release X; vale acompanhar."]*

---

## Times atendidos

| Time      | Demandas | Horas | Destrave principal                 |
| --------- | -------- | ----- | ---------------------------------- |
| Time A    |  X       |  Yh   | *[1 frase]*                        |
| Time B    |  X       |  Yh   | *[1 frase]*                        |
| Time C    |  X       |  Yh   | *[1 frase]*                        |

---

## Destaques do mês (qualitativo)

> *3-5 bullets. Aqui é onde a história aparece. Sem isto, vira tabela morta.*

- **Maior destrave**: [contexto + impacto concreto, ex.: "Resolvi o bug
  de timezone que estava bloqueando o release do Time B; release foi
  pro ar no dia X, evitando atraso de 1 sprint."]
- **Maior risco evitado**: [...]
- **Recorrência atacada**: [se aplicar — ex.: "Padronizei o tratamento
  de erro Y no módulo Z; demandas relacionadas caíram de 12 pra 2 no mês."]
- **Capacitação**: [se aplicar — ex.: "Documentei runbook de X; agora
  Time A resolve sozinho sem abrir ticket."]

---

## Sinais e tendências

> *O que merece atenção da liderança. Tom: alerta antecipado, não reclamação.*

- **[Sinal 1]**: ex.: *"Volume de demandas do Time C cresceu 40% no
  trimestre; vale mapear se é projeto novo ou se tem causa estrutural."*
- **[Sinal 2]**: ex.: *"3 demandas distintas vieram do mesmo módulo X
  no mês — sugere investir em refactor (estimativa: ~3 dias para reduzir
  recorrência)."*
- **[Sinal 3]**: ex.: *"Capacidade saturou em 142h trabalhadas (vs ~140h
  saudáveis); se volume mantiver, lead time vai subir nos próximos meses."*

---

## Próximo mês — foco

> *Trabalho proativo (balde 2) que pretende fazer além do reativo. Mostra
> que você não é só executor de fila.*

- [ ] [Iniciativa estrutural 1 — ex.: "atacar a recorrência do módulo X"]
- [ ] [Iniciativa estrutural 2]
- [ ] [Documentação ou automação]

---

## Anexos

- Planilha de origem: `metrics/registro-tarefas.csv` (commit do mês)
- Tickets do mês: [link Teamwork filtrado por mês]
- Gráficos: `metrics/charts/[mes-ano]/`

---

> *Dúvidas sobre números, contexto ou priorização: chamar [seu canal preferido].*
