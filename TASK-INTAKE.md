# Recebendo uma Tarefa — Playbook do Sênior

> Documento prático: você acabou de receber uma demanda (ticket, mensagem,
> reunião). Antes de abrir IDE, passe por aqui.
>
> Complementa [SENIOR-MINDSET.md](SENIOR-MINDSET.md) com o "como aplicar
> aquilo no momento em que a tarefa chega na sua mão".

---

## Princípio raiz

**80% do tempo de um sênior é gasto fora do código** — entendendo, alinhando,
recortando. Codar é o passo final, não o primeiro.

Se você abre a IDE direto, vai entregar **o que pediram**, não **o que precisavam**.

---

## Fluxo de 7 etapas

```
┌─────────────┐   ┌──────────────┐   ┌─────────────┐   ┌──────────────┐
│ 1. Triar    │ → │ 2. Entender  │ → │ 3. Validar  │ → │ 4. Recortar  │
└─────────────┘   └──────────────┘   └─────────────┘   └──────────────┘
                                                             │
        ┌────────────────────────────────────────────────────┘
        ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│ 5. Estimar   │ → │ 6. Combinar  │ → │ 7. Executar  │
└──────────────┘   └──────────────┘   └──────────────┘
```

Cada etapa tem perguntas pra você e perguntas pra quem abriu.

---

## Etapa 1 — Triar (5 min)

**Objetivo**: decidir se a tarefa é pra agora, pra depois, ou pra ninguém.

### Pergunte a si mesmo
- A demanda é clara o suficiente pra eu sequer avaliar prioridade?
- Cabe na minha capacidade desta sprint/semana?
- Tem dono claro (PM, tech lead, stakeholder)?
- Alguém do time já está fazendo algo parecido?
- É bug, feature, dívida técnica ou pesquisa? (cada um tem rito diferente)

### Pergunte a quem abriu
- "Qual a urgência? Tem prazo duro?"
- "Bloqueia alguém ou algum processo?"
- "Quem é o stakeholder final / quem vai usar isso?"
- "Tem alguém que já trabalhou nisso antes?"
- "É experimento ou já vai pra produção?"

### Sinais para devolver/repassar
- Não tem dono.
- Pertence a outro time/squad.
- Falta contexto fundamental (objetivo do produto, métrica).
- Conflita com outra demanda em andamento.

### Saída desta etapa
- "Aceito" → segue pra Etapa 2.
- "Aceito, mas só na próxima sprint" → registra e segue.
- "Devolvo" → escreve o porquê, sugere caminho.

---

## Etapa 2 — Entender (a etapa onde 80% dos juniores pulam)

**Objetivo**: separar **problema** de **solução proposta**.

A maioria das demandas chega como solução já mastigada ("crie um botão X").
Sua função é desempacotar até o problema.

### Pergunte a si mesmo
- Qual é a **dor** que motivou esse pedido?
- Quem sente essa dor? Com que frequência?
- O que acontece se eu **não fizer** essa tarefa?
- Já existe algo no sistema que resolve parcialmente?
- A solução proposta é a única possível? (frequentemente não é)

### Pergunte a quem abriu — funcional
- **"Que problema você está tentando resolver com isso?"** — pergunta-mestre.
- "Quem é o usuário/persona afetado?"
- "Como isso é feito hoje (workaround, planilha, etc.)?"
- "Como você sabe que isso é um problema? (dado, feedback, intuição?)"
- "O que você espera ver depois de pronto?"
- "Como vamos medir sucesso? (métrica, KPI, NPS, redução de chamado)"
- "Existe alternativa de menor esforço que você consideraria?"

### Pergunte a quem abriu — técnico/integração
- "Esse fluxo passa por quais sistemas?"
- "Tem dependência de outro time/serviço/API?"
- "Tem volume esperado? (10/dia, 10k/dia, 10M/dia muda tudo)"
- "Tem requisito de SLA, latência, disponibilidade?"
- "Existe restrição de compliance/LGPD/auditoria?"
- "Passou por design/UX? Tem mockup/wireframe?"

### Técnica do "5 Whys"
> "Por que precisamos disso?" → resposta → "Por que isso importa?" → ... 5x

Quando chegar numa resposta tipo "porque o cliente perde dinheiro" ou "porque
o regulador exige", você achou o **valor real**. O que veio antes era sintoma.

### Anti-padrões a evitar
- **Aceitar a primeira explicação.** Júnior aceita; sênior cava.
- **Confundir requisito com implementação.** "Quero um botão azul" não é requisito,
  é solução. O requisito é "preciso reverter pedido em 2 cliques".
- **Não perguntar pra não parecer ignorante.** Perguntas boas mostram senioridade,
  não desconhecimento.

---

## Etapa 3 — Validar premissas

**Objetivo**: derrubar premissas frágeis **antes** de codar (custo barato).

### Liste por escrito
Pegue 10 minutos e escreva:
1. Premissas funcionais ("o usuário sempre tem CPF")
2. Premissas técnicas ("a API X devolve em <500ms")
3. Premissas de escala ("até 1000 itens por requisição")
4. Premissas de prazo ("vai pro ar dia X")

Cada uma:
- ✅ Validada (você confirmou com dado/pessoa)
- ❓ A confirmar (precisa perguntar)
- ⚠️ Risco (pode quebrar e não tem plano B)

### Como validar barato
- Ler código existente (`git log`, `grep`).
- Olhar Swagger/OpenAPI da API.
- Rodar SQL exploratório: "quantos registros tem hoje? qual a distribuição?"
- Conversar com o owner do sistema downstream **antes** de assumir contrato.
- POC de 30 minutos > debate de 2h sobre se "deve funcionar".

### Pergunte a quem abriu
- "Posso assumir que [premissa]? Se não, qual o caso real?"
- "Tem dado histórico que comprove [comportamento]?"
- "O que acontece quando [edge case]?"

### Edge cases que sempre cabem perguntar
- Dados em branco/null/vazios.
- Volume muito alto (lista de 10k).
- Volume zero (lista vazia).
- Acentos, emojis, encoding.
- Timezones e horário de verão.
- Duas requisições concorrentes do mesmo usuário.
- Falha do sistema downstream.
- Permissão/autorização (quem pode fazer o quê).

---

## Etapa 4 — Recortar (slice)

**Objetivo**: transformar a demanda em **entregas pequenas e independentes**.

### Princípio
> Entrega pequena = feedback rápido = risco baixo.
> Big bang de 3 semanas = decisão errada descoberta tarde.

### Como recortar
Se a tarefa cabe em <1 dia: não precisa recortar.
Se >1 dia, divida em "fatias verticais" (do botão ao banco), nunca em "fatias
horizontais" (DB primeiro, depois API, depois UI — você só entrega valor no fim).

| Tarefa grande                    | Recorte ruim (horizontal)        | Recorte bom (vertical)                            |
| -------------------------------- | -------------------------------- | ------------------------------------------------- |
| "Implementar checkout"           | 1) DB 2) API 3) UI 4) integração | 1) Checkout só com PIX 2) +cartão 3) +cupom       |
| "Dashboard de vendas"            | 1) modelo 2) endpoint 3) tela    | 1) Card "vendas hoje" 2) +faturamento 3) +gráfico |
| "Migrar autenticação para OAuth" | 1) backend 2) frontend           | 1) Login OAuth coexistindo com legado 2) Cutover  |

### Pergunte a quem abriu
- "Se tivermos só X pronto na 1ª semana, ajuda você?"
- "O que é MVP de verdade aqui? Quais features são 'gostaria de ter'?"
- "Posso entregar em fases? Quais features são bloqueantes pra ir ao ar?"

### Saída
Lista de PRs/tarefas, cada um:
- Independente (pode ser deployado sozinho).
- Reversível (feature flag, migration backward-compatible).
- Pequeno (idealmente <400 linhas de diff).
- Com critério de aceite explícito.

---

## Etapa 5 — Estimar (com humildade)

**Objetivo**: dar visibilidade de prazo **sem mentir**.

### Regras
- **Estime em ranges, não em pontos cravados**: "entre 2 e 5 dias" é honesto;
  "3 dias" é falso precisão.
- **Estime depois de ter recortado.** Estimar a tarefa inteira é chute.
- **Inclua o "imposto"**: code review, QA, deploy, ajustes pós-feedback,
  documentação. Geralmente +30 a +50%.
- **Inclua riscos identificados**. "Se a API X não funcionar como esperamos,
  +2 dias."

### Pergunte a si mesmo
- Já fiz algo parecido? Quanto demorou?
- Onde tem incerteza (= risco de prazo)?
- Quem mais precisa estar disponível? (revisor, QA, infra)
- Tem dependência externa (time X precisa entregar Y)?

### Pergunte a quem abriu
- "Existe data dura? (lançamento, regulatório, contrato)"
- "Se eu te dar X em 2 dias e Y em 5, te atende? Ou precisa de tudo junto?"
- "Quem é o backup se eu ficar doente?"

### Sinal de alerta
Se você sente pressão pra estimar **menos** do que acha realista — **não baixe**.
Documente o motivo do prazo e quem decidiu aceitar o risco.

---

## Etapa 6 — Combinar (definir contrato de entrega)

**Objetivo**: alinhamento explícito antes de começar.

### Documento de 1 página (DoR — Definition of Ready)
Antes de começar, escreva e mande pra quem pediu confirmar:

```markdown
## Tarefa: <título>

### Problema
<1 parágrafo — o problema, não a solução>

### Solução proposta
<1 parágrafo — alto nível>

### Critério de aceite
- [ ] Item 1 testável
- [ ] Item 2 testável
- [ ] Item 3 testável

### Fora de escopo (explícito)
- Item X — fica pra próxima fase
- Item Y — não é problema deste módulo

### Premissas
- ...

### Riscos
- ...

### Estimativa
~X-Y dias úteis (inclui review e deploy).

### Métrica de sucesso
<como saberemos que funcionou em prod?>
```

### Por que vale o esforço
- Força o stakeholder a **pensar** antes de validar.
- Protege você se mudarem de ideia ("estava aqui no doc, você aprovou").
- Vira material pro PR description e pro changelog.

### Pergunte a quem abriu
- "Esse entendimento bate com o seu? Preciso ajustar algo?"
- "O que está fora de escopo aqui te preocupa? Devemos abrir ticket separado?"
- "Quem mais precisa aprovar antes de eu começar?"

---

## Etapa 7 — Executar (finalmente!)

Agora sim, codar. Mas com hábitos sêniores:

### Antes de cada commit
- Roda teste local.
- Lê o próprio diff como se fosse de outra pessoa.
- Mensagem de commit explica **POR QUÊ**, não só o quê.

### Durante a execução
- **Reporta progresso antes que perguntem.** Status async (Slack/PR description)
  no fim do dia.
- Se descobre que a estimativa estava errada: avisa cedo, não no deadline.
- Se descobre que o requisito está errado: para, conversa, **não** force pra
  fora a solução errada.

### Quando travar (>2h sem progresso)
- Documente o que tentou (até pra você lembrar).
- Pede ajuda. Sênior pede ajuda; "ego de não pedir" é júnior disfarçado.
- Trabalha em outra coisa enquanto espera resposta — não fica refém.

### Finalizando
- PR com **descrição** (problema, solução, como testar, screenshots se UI).
- Liga PR ao ticket.
- QA/teste manual passou.
- Documentação atualizada se mudou contrato/comportamento.
- Se foi bug: postmortem curto (causa raiz + prevenção).

---

## Templates práticos

### Template 1 — Pergunta de entendimento (Slack/email)
> Oi [pessoa], pegando o ticket [#X]. Antes de começar, quero garantir que
> entendi:
>
> 1. O **problema** é [...]?
> 2. O **usuário afetado** é [...]?
> 3. **Sucesso** será medido por [...]?
> 4. Itens **fora de escopo**: [...]. OK?
>
> Tenho 3 dúvidas:
> - [...]
>
> Te devolvo a estimativa após validar essas premissas. Quando puder responder?

### Template 2 — Sinalizar mudança de escopo
> Oi [pessoa], em [tarefa X] descobri que [contexto inesperado]. Isso impacta
> o escopo:
>
> **Opções:**
> - **A:** Sigo o plano original — entrega no prazo, mas [limitação].
> - **B:** Ajusto pra cobrir [novo caso] — atrasa em ~Y dias.
> - **C:** Entrego A agora, B em ticket separado.
>
> Minha recomendação é **C** porque [...]. Te ajuda decidir até [data]?

### Template 3 — Recusar/redirecionar
> Oi [pessoa], obrigado por trazer. Não consigo pegar agora porque [motivo
> objetivo: capacidade, falta de contexto, outro dono].
>
> Sugestões:
> - Falar com [outra pessoa/time] que conhece esse domínio.
> - Reabrir em [data X] quando [contexto Y mudar].
> - Criar como tech-debt e priorizar na próxima rodada.
>
> Posso ajudar a fazer essa transição. Como prefere seguir?

---

## Checklist mental (cole no monitor)

Toda tarefa nova passa por isto antes de você abrir IDE:

```
[ ] Sei QUEM ganha com isso?
[ ] Sei QUE PROBLEMA resolve (não só "o que faz")?
[ ] Sei COMO MEDIR sucesso?
[ ] Tenho FORA-DE-ESCOPO explícito?
[ ] Listei PREMISSAS e validei as críticas?
[ ] Mapeei DEPENDÊNCIAS (sistemas, pessoas)?
[ ] Pensei em EDGE CASES (vazio, N grande, concorrência, falha)?
[ ] Considerei SEGURANÇA, LGPD, auditoria?
[ ] Recortei em PRs <400 linhas, independentes?
[ ] Dei estimativa em RANGE com imposto?
[ ] Combinei contrato (DoR) com quem pediu?
[ ] Combinei como REPORTAR progresso?
```

Se algum quadrado está vazio, **volte uma etapa**. Não vai pro IDE.

---

## Sinais de que você está aplicando bem

- Pessoas começam a te procurar **antes** de escrever ticket — pra refinar.
- PRs voltam menos do review.
- Você raramente entrega tarde "por causa de coisa imprevista" (porque
  imprevistos viraram premissas validadas no início).
- Stakeholder não-técnico te entende.
- Júniores copiam seu jeito de fazer descrição de tarefa.

---

## Sinais de que ainda não chegou lá

- Recebeu ticket → abriu IDE em 5 minutos.
- Descobre regra de negócio só durante o review.
- Precisa "explicar de novo" o que fez em toda demo.
- "Quase pronto" há 3 dias.
- Reclama em retro que "não tinha contexto" — sem ter perguntado.

---

## Resumo numa frase

> **A tarefa não é "implementar X". É "entregar valor Y, sabendo que X é a
> hipótese atual de como conseguir Y, podendo trocar X por Z se aparecer
> evidência durante o caminho."**

Internalize isso e o resto desemboca naturalmente.
