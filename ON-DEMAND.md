# Trabalho Sob Demanda — Sobrevivendo ao Fluxo Contínuo

> Cenário: você **não** trabalha por sprint. Demandas chegam o dia inteiro,
> de stakeholders diferentes, com urgências misturadas. Pode ser:
> - time de sustentação / suporte N3
> - dev em consultoria / freelancer
> - SRE / DevOps / DBA
> - dev interno em empresa pequena
> - "single dev" de produto
> - time pequeno sem PM
>
> Este doc é o complemento prático do [TASK-INTAKE.md](TASK-INTAKE.md) para
> quem **não tem o luxo** de batch planning.

---

## Diagnóstico: você está em modo sob demanda?

Sintomas:
- Mais de **3 fontes** de demanda (Jira, Slack, e-mail, reunião, "passa só
  rapidinho").
- Nunca termina o dia "no que planejou de manhã".
- Difícil dizer no que trabalhou em retrospectiva — foi tudo um borrão.
- Quem grita mais alto vence a fila.
- Métrica de avaliação parece subjetiva ("disponibilidade", "ajuda o time").
- Burnout silencioso instalado.

Se reconhece isso, este documento é pra você.

---

## Princípio raiz

> **Sob demanda, sua função principal não é codar — é triar.**
>
> Quem confunde os dois vira **fila humana**: executa tudo que chega na ordem
> que chega, sem critério, e nunca vai pra casa.

---

## A regra dos 4 baldes (quadrante de Eisenhower aplicado)

Toda demanda cai em um:

```
                URGENTE                    NÃO URGENTE
              ┌──────────────────────┬──────────────────────┐
   IMPORTANTE │  1. FAZER AGORA      │  2. AGENDAR          │
              │  (incêndio real)     │  (trabalho profundo) │
              ├──────────────────────┼──────────────────────┤
   NÃO        │  3. DELEGAR/RECUSAR  │  4. DESCARTAR        │
   IMPORTANTE │  (urgência alheia)   │  (ruído)             │
              └──────────────────────┴──────────────────────┘
```

### Como reconhecer cada um

| Balde       | Sinais                                                 | Resposta              |
| ----------- | ------------------------------------------------------ | --------------------- |
| 1 Faça já   | Produção fora, perda de receita, risco legal, segurança | Largue tudo, vá       |
| 2 Agende    | Refactor, migração, doc, observabilidade, melhoria UX  | Bloqueie horário      |
| 3 Delegue   | "Urgente" do outro time que não muda seu OKR           | Redirecione com nome  |
| 4 Descarte  | Curiosidade alheia, "será que dá pra…"                 | Diga não educadamente |

A maioria do que chega como balde 1 é, na verdade, balde 3. Aprender essa
distinção é metade do salário sênior.

---

## Filtro de chegada — perguntas em 60 segundos

Quando uma demanda cai no seu colo, **antes de abrir IDE**, em 60s responda:

1. **Quem é o impacto e qual o tamanho?** (1 pessoa irritada vs cliente perdendo
   dinheiro vs sistema todo fora)
2. **Tem prazo real ou prazo emocional?** ("preciso pra ontem" sem motivo ≠ urgência)
3. **Existe workaround temporário?** Se sim, urgência cai 90%.
4. **Quem é o dono?** Se não for você, repasse com nome (não "fala com o time").
5. **Estou no meio de algo mais crítico?** Comparar é obrigatório.

Se você não consegue responder em 60s, **a demanda não está pronta**.
Devolve com perguntas. Não absorve incerteza alheia.

---

## SLA pessoal (defenda o seu)

Sem sprint, você precisa dos **seus** acordos de nível de serviço:

| Tipo de demanda             | Resposta inicial | Início real     | Conclusão típica |
| --------------------------- | ---------------- | --------------- | ---------------- |
| P0 — incêndio em produção   | <5 min           | imediato        | até resolver     |
| P1 — bug crítico c/ workaround | <2h           | hoje            | 1-3 dias         |
| P2 — bug normal             | <1 dia útil      | esta semana    | 1-2 semanas      |
| P3 — melhoria/feature pequena | <2 dias úteis  | conforme fila  | quando der       |
| P4 — "ideia"                | <1 semana        | "vamos avaliar" | talvez nunca     |

**Documente isto e divulgue.** Quem não conhece o SLA fica ansioso e
escala todo mundo pra P0. Quem conhece, espera com paciência.

### Frase pra usar
> "Recebi. Pelo critério X, isso é P2. Devo começar entre [data] e [data].
> Se mudou alguma coisa que justifique reclassificar pra P1, me avisa."

---

## Anatomia da demanda mal formada

Demandas sob demanda chegam **mal escritas** quase sempre. Formato típico:

> "preciso q vc arruma um bug q ta dando lá na tela tipo qnd clica n vai"

Resposta padrão:

> "Pra atacar isso preciso de 3 coisas:
> 1. **Print do erro** ou da tela.
> 2. **Passos pra reproduzir** (cliquei em A → B → erro).
> 3. **Quando começou** e se acontece com todo mundo ou só com você.
>
> Manda esses 3 que a partir daí eu encaixo na fila pelo critério.
> Sem isso, fica difícil priorizar."

### Por que isso funciona
- Filtra ruído (50% das pessoas desiste no meio do print).
- Te dá insumo pra trabalhar.
- Educa o solicitante a pedir melhor da próxima.
- **Joga a bola de volta** sem parecer rude — está pedindo info, não negando.

---

## Lei de "primeiro chegou ≠ primeiro feito"

A regra do jurássico é FIFO ("primeiro a chegar, primeiro atendido").
Em ambiente sob demanda, FIFO mata você.

### Use estes critérios em ordem
1. **Bloqueio de produção** — sempre primeiro.
2. **Custo de adiar** — quanto se perde por dia de atraso?
3. **Custo de fazer** — esforço × incerteza.
4. **Reversibilidade** — coisa irreversível espera mais design.
5. **Quem está bloqueado** — 5 pessoas paradas > 1 pessoa irritada.
6. **Data de entrada** — só desempata o resto.

### Frase mágica de priorização
> "Tenho [tarefa A] e [tarefa B] na fila. Pelo meu critério, A vem antes
> porque [razão]. Concorda? Se priorizar B, A atrasa em [X dias]."

Você não está pedindo permissão pra priorizar — está **mostrando o trabalho
que está fazendo** de priorizar. Se ninguém contestar, segue. Se contestarem,
combina e segue.

---

## Bloco de foco vs janela de interrupção

Você não consegue fazer trabalho profundo no meio de Slack pingando.
A solução é **ritmizar**:

```
09:00-11:30  | FOCO (trabalho profundo, notificações off)
11:30-12:00  | JANELA (responde Slack, e-mail, triagem)
12:00-13:00  | almoço
13:00-15:30  | FOCO
15:30-16:00  | JANELA
16:00-17:30  | FOCO
17:30-18:00  | JANELA + planejamento do dia seguinte
```

### Regras
- Em FOCO, **só responda P0**. Tudo mais espera 2h, mundo não acaba.
- Avise o time: "Estou em foco até 11:30. Urgente, me marca @aqui."
- Em JANELA, processe **todas** as caixas de entrada (Slack, e-mail, ticket).
- Jamais agende reunião dentro de FOCO.

### Por que funciona
Context switching custa ~23 minutos pra recuperar foco (estudo de UC Irvine).
3 interrupções/h = 0% de produtividade. Bloco de 2h sem interrupção = mais
saída que 8h fragmentadas.

---

## Inbox = staging area, não TODO

E-mail, Slack, Jira **não são lista de tarefas**. São **caixa de entrada**.

### Workflow
1. Em cada janela de interrupção, processe a caixa **toda** rapidamente:
   - **Lixo** → arquiva.
   - **Resposta <2 min** → responde na hora.
   - **Tarefa real** → vai pro seu sistema único de tarefas.
   - **Aguardando alguém** → vai pra lista "@waiting" com data limite.
2. Caixa de entrada vazia ≠ trabalho terminado. É só "triagem feita".
3. Trabalho real você puxa do **seu** sistema, com **suas** prioridades.

### Sistema único de tarefas
Pode ser:
- Quadro Kanban (Trello, Linear, GitHub Projects, Notion).
- Lista markdown num arquivo `tasks.md` versionado.
- Issue tracker da empresa, **se** você usa de fato.

O importante: **uma única lista**, com prioridade explícita, que você revisa
no início e fim de cada dia.

---

## Cadência mínima sem sprint

Mesmo sem sprint formal, mantenha rituais leves:

### Diário (10 min, manhã)
- Olhar a lista. Escolher 1-3 itens "se eu só fizer isto, foi um bom dia".
- Identificar bloqueios e pingar quem precisa.

### Semanal (30 min, sexta tarde)
- Revisar o que entrou na semana, o que saiu.
- Identificar padrões: "5 tickets do mesmo módulo → vale tech-debt?"
- Atualizar a fila pra segunda.
- Mandar status semanal pro stakeholder principal — proativo > reativo.

### Mensal (1h)
- Análise das demandas recebidas: que tipo cresceu? que tipo sumiu?
- Que trabalho proativo (balde 2) ficou esquecido?
- Renegociar SLA / contrato se a demanda mudou de perfil.

---

## Status report semanal (template)

Quem trabalha sob demanda **precisa** comunicar valor — ninguém vai falar
por você.

```markdown
## Semana de [data]

### Resolvido
- [ticket-1] Bug X — impacto: [Y clientes afetados]
- [ticket-2] Migração de Z — impacto: [redução de N% em Q]
- ...

### Em andamento
- [ticket-3] Refactor W — previsão: próxima semana

### Bloqueios
- Aguardando aprovação do time A para [...]
- Esperando dado de [...]

### Métricas
- Demandas recebidas: 23
- Resolvidas: 19
- Tempo médio de resposta: 4h
- Tempo médio de resolução: 1.8 dias

### Riscos / Sinais
- Volume cresceu 30% — tendência? (avaliar próxima semana)
- 4 demandas recorrentes do módulo X — sugiro investigar causa raiz
```

### Por que importa
- **Visibilidade**: gestor sabe o que entregou sem perguntar.
- **Argumento**: ano que vem, na PDI/aumento, você tem dado.
- **Defesa**: quando alguém disser "você não fez nada", você tem fato.
- **Tendência**: identifica problemas sistêmicos (volume crescendo, recorrência).

---

## Combatendo recorrência (a regra dos 3)

Se um problema **igual** aparece 3 vezes, **pare de resolver e investigue
a causa raiz**.

### Padrão
- 1ª vez: resolve e segue.
- 2ª vez: resolve e anota.
- 3ª vez: **não** resolve direto — abre tarefa de "atacar a fonte".

### Soluções estruturais comuns
- **FAQ / runbook** — quando é falta de info do solicitante.
- **Self-service** — quando é operação repetitiva (botão na admin).
- **Fix de raiz** — quando é bug de design.
- **Alerta + automação** — quando é problema previsível.
- **Doc operacional** — pra outro dev resolver sem precisar de você.

### Por que isso é pensamento sênior
Trabalho sob demanda **sem combate à recorrência** vira tratamento sintomático
infinito. Sênior reduz volume **estruturalmente**, não só processa mais rápido.

---

## Defendendo balde 2 (o trabalho que ninguém pede)

Trabalho importante e não-urgente (refactor, observabilidade, doc, automação,
testes) **nunca** vai chegar como demanda. Mas é o que diferencia sistema
saudável de bola de neve.

### Estratégias
- **Capacidade fixa**: reserve 20% da semana pra balde 2. Bloqueie na agenda
  como "manutenção". É inegociável.
- **Vincule a demanda**: ao resolver bug, leve junto a melhoria estrutural
  que evita o próximo. PR de bug fix + teste + log + alerta.
- **Comunique o ROI**: "investi 4h em automação X, agora 10h/mês de toil
  somem". Mostra retorno.

### Quando não dá
Se você está em modo bombeiro permanente (>80% balde 1), o problema não é
priorização — é **dimensionamento**. Faça o caso para mais gente, não
trabalhe mais horas.

---

## Quando dizer NÃO (e como)

Você precisa dizer não. Sob demanda, dizer sim a tudo é falência garantida.

### Padrões de "não" elegante
- **Não, mas redirecionando**: "Isso é mais com o time X, copiei a [pessoa]."
- **Não agora**: "Tenho A e B na frente. Posso ver a partir de [data]."
- **Não, mas alternativa**: "Não dá nesse formato, mas [alternativa] resolveria?"
- **Não, com explicação**: "Esse esforço seria de Z dias, e o ganho parece
  pequeno. Vale repensar?"
- **Não definitivo**: "Isso conflita com [diretriz]. Se quiser revisar,
  sugiro abrir com [responsável]."

### Como dizer
- **Rápido**: deixar pendurado é pior que negar logo.
- **Por escrito**: registro evita "mas você disse que ia".
- **Com substituto**: nunca só "não" — sempre "não, e o caminho é Y".
- **Sem dar volta**: "tô vendo, depois te falo" usado como "não" envenena
  a relação.

---

## Quando dizer SIM e se arrepender (red flags)

Aceitou e agora está afundando? Sinais:

- Estimativa que dobrou na primeira semana.
- 3 dependências que ninguém mapeou.
- Stakeholder mudando de ideia toda reunião.
- "Quase pronto" há 2 semanas.

**Não esconda.** Quanto antes sinalizar, mais barato corrigir.

### Frase de SOS profissional
> "Quero dar um update honesto: [tarefa X] está mais complexa que estimei.
> Razões: 1) [...] 2) [...]. Vejo 3 caminhos:
> - **Continuar**: +N dias, escopo igual.
> - **Reduzir escopo**: corta [Y] e entrego em [data].
> - **Pausar**: deixo [Z funcionando] e reabro com mais info.
>
> Recomendo [opção]. Conseguimos decidir até [data]?"

---

## Métricas pessoais que importam

Se você não mede, não melhora. Pra trabalho sob demanda, acompanhe:

| Métrica                          | Por quê                                 |
| -------------------------------- | --------------------------------------- |
| Tempo médio de resposta inicial  | Atendimento percebido                   |
| Tempo médio de resolução por P   | Saúde da fila                           |
| % balde 2 (proativo) por semana  | Investimento em qualidade               |
| Taxa de retrabalho (PRs reabertos) | Qualidade da entrega                  |
| Tickets recorrentes (mesma raiz) | Sinal de problema estrutural            |
| Interrupções/dia                 | Foco real possível                      |

Não precisa ser planilha sofisticada. Conte na mão uma vez por mês.

---

## Sinal de saturação (e o que fazer)

Você passou do limite quando:
- Está respondendo Slack às 23h por padrão.
- Não consegue tirar férias sem ansiedade.
- Sente que "se eu sumir, tudo cai".
- Errou em coisa boba duas semanas seguidas.

**Não é fraqueza, é dado.** Aja:

1. **Documente o que só você sabe.** Bus factor 1 é problema, não trunfo.
2. **Mostre o número.** "Esta semana foram 35 tickets, capacidade saudável
   é 20." Dado >> reclamação.
3. **Renegocie SLA temporariamente.** Volume cresceu? Resposta cresce.
4. **Peça reforço com plano.** Não "estou cansado", e sim "se contratarmos
   N, em M meses ROI é X".
5. **Tire férias de verdade.** Sem laptop. Combine cobertura.

---

## Quando o problema é o sistema, não você

Às vezes nenhuma técnica deste doc resolve, porque o problema é
**organizacional**:

- Empresa sem produto/PM, todo mundo é stakeholder.
- Cultura de "tudo urgente".
- Liderança que recompensa quem grita mais.
- Falta de critério público de prioridade.

Aí você tem 3 caminhos:
1. **Influenciar pra mudar** — propor processos, mostrar dado, ser exemplo.
2. **Aceitar e proteger seu perímetro** — aplicar tudo deste doc dentro
   do que controla.
3. **Sair** — quando 1 e 2 falham repetidamente, é decisão de carreira.

Sênior reconhece quando o sistema é o gargalo e age conforme. Não tenta
remar oceano com colher.

---

## Checklist de sobrevivência (cole no monitor)

Diariamente:
```
[ ] Caixa(s) de entrada processada(s) em janela definida (não no meio do foco)
[ ] 1-3 prioridades do dia escritas
[ ] Bloco de foco respeitado
[ ] Status proativo enviado a quem importa
[ ] Sistema único de tarefas atualizado
```

Semanalmente:
```
[ ] Status report enviado
[ ] Recorrências mapeadas (regra dos 3)
[ ] 20% para balde 2 cumprido?
[ ] Métricas pessoais anotadas
[ ] Próxima semana planejada
```

Mensalmente:
```
[ ] Tendências de volume e tipo
[ ] Renegociações necessárias?
[ ] Saúde própria — sinais de saturação?
[ ] Trabalho estrutural (balde 2) suficiente?
```

---

## Resumo

Trabalhar sob demanda **bem** é uma disciplina por si só, e raramente é
ensinada. Os dois movimentos centrais:

1. **Defender o critério** — a fila é sua, não dos solicitantes. Você prioriza
   com base em impacto, não em volume de gritos.
2. **Atacar a fonte, não o sintoma** — toda hora gasta resolvendo recorrência
   é hora roubada de eliminar a recorrência.

Quem domina os dois transforma "fila de tickets infinita" em **sistema com
métricas, SLA, trabalho estrutural e tempo livre**. Quem não domina, vira
mártir produtivo até pedir demissão.

Escolha o primeiro.
