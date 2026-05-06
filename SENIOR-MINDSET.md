# Pensamento Sênior — agnóstico de linguagem

> Este documento NÃO é sobre React, Java, ou qualquer stack específica. É sobre
> **como pensar** quando você está construindo software profissionalmente —
> independente de ser frontend, backend, mobile, infra, dados ou jogos.
>
> Se o [STUDY-PATH.md](STUDY-PATH.md) é o "o que estudar", este aqui é o
> "como pensar enquanto estuda e enquanto trabalha".

---

## Princípio raiz

**Sênior não é alguém que escreve código difícil. É alguém que escolhe o código
mais simples que resolve o problema certo, e consegue defender essa escolha com
argumentos.**

Tudo neste documento é corolário disso.

---

## 1. Otimize para a próxima pessoa, não para você hoje

Você passa muito mais tempo lendo código do que escrevendo. O time também.
Cada decisão de design é, no fundo, uma mensagem para o próximo dev (que pode
ser você daqui a 6 meses, sem lembrar de nada).

### Como aplica
- **Nomes** são API pública. `calcularFaturamentoDoDia()` é melhor que `calc(d)`.
- Comentários explicam **POR QUÊ**, nunca **O QUÊ** (o código já mostra o quê).
- Se um trecho exige comentário pra ser entendido, primeiro tente reescrevê-lo
  pra não precisar do comentário.
- **Consistência > preferência pessoal**. Num código com `_id`, não introduza `pk`.

### Sinal de que você está acertando
Outra pessoa abre seu PR, lê o diff, entende a intenção sem perguntar nada e
aprova. Você não precisou explicar em call.

---

## 2. Antes de escrever, entenda o problema

Júnior ouve "preciso de um botão X" e codifica.
Sênior pergunta:
- Qual é a dor real do usuário/cliente que esse botão resolve?
- Existe forma de não precisar do botão?
- Quem mais é afetado por essa mudança?
- Como saberemos que funcionou? (métrica)

### Técnicas práticas
- **5 Whys**: pergunte "por quê" cinco vezes seguidas para chegar à causa raiz.
- **User story invertida**: escreva o requisito como "Como [persona], eu quero
  [X] para [Y]". Se Y é vago, o requisito está mal definido.
- **Assumption stack**: liste suas premissas. As que você não consegue validar
  rapidamente são risco.

### Custo de pular essa etapa
Você entrega o que pediram, não o que precisavam. Refaz tudo no sprint seguinte.

---

## 3. Pense em **trade-offs**, não em "melhor prática"

Não existe "melhor prática" universal. Existe trade-off contextual.

| Decisão                        | Eixos do trade-off                              |
| ------------------------------ | ----------------------------------------------- |
| Microserviços vs monolito      | Velocidade inicial × escalabilidade × ops cost  |
| ORM vs SQL puro                | Produtividade × controle × performance          |
| Tipagem estática vs dinâmica   | Velocidade de prototipação × segurança refactor |
| Otimista vs pessimista (UI)    | UX percebida × consistência                     |
| Cache agressivo vs sob demanda | Latência × frescor do dado × invalidação        |
| Async vs sync                  | Throughput × complexidade × debugabilidade      |

### Frase mágica em entrevista/code review
> "Depende. Se [contexto A], faria X porque [razão]. Se [contexto B], Y porque
> [outra razão]. No nosso caso, é A, então X."

Quem responde com "use X sempre" mostra que ainda está repetindo receita.

---

## 4. Escreva menos código

Cada linha de código é um passivo: alguém precisa ler, manter, testar, debugar,
e às vezes apagar com cuidado.

### Hierarquia de soluções (do mais barato pro mais caro)
1. **Não fazer** — o requisito é mesmo necessário?
2. **Configurar** — alguma coisa pronta resolve?
3. **Compor** — combinar peças existentes.
4. **Estender** — adicionar a algo que existe.
5. **Escrever do zero** — último recurso.

### Sinais de over-engineering
- Abstração com 1 implementação concreta. ("E se um dia precisarmos de outro
  banco?" — quando esse dia chegar, refatore.)
- Generalização especulativa. YAGNI: **You Aren't Gonna Need It**.
- Camadas de "manager", "helper", "service" que só repassam chamada.
- Padrões de projeto aplicados pra exibir conhecimento (Strategy onde um `if`
  resolveria).

### Regra prática
> Se duvidar entre duas soluções, escolha a mais boba. É mais fácil
> sofisticar o simples do que simplificar o sofisticado.

---

## 5. Estado é o inimigo

A maioria dos bugs vem de estado mal modelado. Vale para qualquer linguagem.

### Princípios
- **Imutabilidade** sempre que possível (cópia em vez de mutação).
- **Single source of truth**. Se o mesmo dado vive em dois lugares, em algum
  momento eles vão divergir.
- **Estado derivado** se calcula a partir de estado primitivo, não duplica.
- **Boundaries explícitas**: estado local de UI ≠ estado de servidor ≠ estado
  global ≠ estado de URL. Cada um tem seu lugar; não misture.

### Backend
- DB é a fonte da verdade. Cache é eventual e descartável.
- Transações são o limite de consistência. Saber isso evita 80% dos bugs.

### Frontend
- "É bug ou é estado mal modelado?" — geralmente o segundo.
- Lifting state up até o mínimo ancestral comum, não mais alto.

---

## 6. Erros são features

Sucesso é fácil de programar; o que separa código júnior de sênior é como
lida com falha.

### Cheque sempre
- O que acontece se a rede cair no meio?
- O que acontece se o disco encher?
- O que acontece se duas requisições competirem?
- O que acontece se a entrada vier malformada?
- O que acontece se o usuário clicar duas vezes?

### Padrões úteis
- **Idempotência**: a mesma operação executada N vezes tem o mesmo efeito que 1.
- **Retry com backoff exponencial + jitter**: nunca retry imediato, nunca retry
  infinito.
- **Circuit breaker**: param de tentar quando o downstream está caído.
- **Dead letter queue**: o que não foi processado vai pra um lugar, não some.
- **Graceful degradation**: o app não cai, vira modo limitado.
- **Fail fast em DEV, fail safe em PROD** — exceto quando segurança/dinheiro
  estão em jogo (aí fail safe sempre).

### Mensagem de erro útil
- Para o usuário: o que aconteceu + o que ele pode fazer agora.
- Para o dev (log): timestamp, request id, contexto, stack.
- Nunca exponha stack trace em UI ou em response pública.

---

## 7. Performance: meça, não adivinhe

> Premature optimization is the root of all evil. — Donald Knuth

Mas otimização **tardia** também: se você só pensa em performance quando o
sistema já está em chamas, você perdeu.

### A ordem certa
1. **Funcionou?** Faça funcionar.
2. **Está correto?** Garanta correção (testes).
3. **É legível?** Refatore.
4. **Está rápido o bastante?** SOMENTE AGORA pense em perf.

Saber o que é "rápido o bastante" exige métrica. Sem número, é palpite.

### Lições gerais
- I/O é ordens de magnitude mais lento que CPU. 99% das vezes, o gargalo
  é IO/rede/DB, não algoritmo.
- N+1 query é o bug de performance mais comum em qualquer ORM.
- Cache resolve **leitura**; piora **escrita** e adiciona problema novo:
  invalidação. (Phil Karlton: "There are only two hard things in Computer
  Science: cache invalidation and naming things.")
- Big-O importa quando N é grande. Para N pequeno, constantes dominam.

### Ferramentas que todo sênior usa
- Profiler da linguagem (perf, py-spy, flamegraphs).
- DB EXPLAIN (cada banco tem o seu).
- Network waterfall (Chrome DevTools, Wireshark).
- APM (Datadog, New Relic, Sentry Performance).

---

## 8. Concorrência: assuma que tudo vai dar errado ao mesmo tempo

Em produção, requisições paralelas, race conditions, deadlocks acontecem.

### Cheque mental
- Esse código pode rodar 2x ao mesmo tempo? O que muda?
- Se o processo cair entre a linha N e N+1, fica num estado válido?
- Estou usando o nível de isolamento certo na transação?
- Optimistic vs pessimistic locking — qual cabe aqui?

### Receitas
- Operações idempotentes sempre que possível.
- Use IDs gerados pelo cliente (UUID) para evitar duplicidade em retry.
- Em filas, garanta "exactly once" via deduplicação no consumidor (broker
  raramente garante de fato).

---

## 9. Segurança não é feature opcional

### Lista mínima
- **Nunca confie em input** (usuário, API parceira, arquivo).
- **Validação de schema na borda** (JSON schema, Bean Validation, Zod, Pydantic).
- **Escape contextual** (SQL → parametrizado, HTML → escape, shell → libs, não
  string concatenation).
- **Princípio do menor privilégio** — o serviço só pode fazer o que precisa.
- **Defesa em profundidade** — múltiplas camadas (WAF + auth + autz + audit).
- **Segredos fora do código.** Sempre. Use vault, env, secret manager.
- **Logs sem PII**. Tokens, senhas, CPFs nunca em log.
- **Atualize dependências.** CVEs novos saem todo dia.

### OWASP Top 10
Decore. Saiba o que é injection, broken auth, IDOR, SSRF, XSS, CSRF, deserialização
insegura. Independe da stack.

---

## 10. Testes: a pirâmide e a frase mágica

### Pirâmide
- Muitos **unit tests** (rápidos, isolados, baratos).
- Alguns **integration tests** (módulo + dependência real, ex: DB).
- Poucos **e2e tests** (sistema todo, do botão ao DB).

Inverter a pirâmide (muitos e2e, poucos unit) gera test suite lenta e flaky.

### Frase mágica
> "Esse teste falharia se eu quebrasse o comportamento que importa, e
> passaria se eu refatorasse a implementação?"

Se sim, é teste bom. Se ele quebra a cada refactor sem ter mudado comportamento,
ele está testando implementação — está atrapalhando, não ajudando.

### O que NUNCA testar
- Detalhe interno privado.
- Framework alheio.
- "Se chama o método X" sem checar o efeito.

---

## 11. Code review é o multiplicador silencioso

Sênior não cresce só pelo código que escreve. Cresce pelos PRs que revisa
e tem revisado.

### Como revisar bem
- Comece pela descrição: ela existe e faz sentido?
- Veja o teste antes da implementação.
- Comente perguntando, não afirmando: "qual a razão de X aqui?" em vez de
  "X está errado".
- Distinga tipos de comentário: `nit:` (cosmético), `suggestion:`,
  `question:`, `blocker:` (precisa resolver).
- Não bloqueie por preferência pessoal sem justificativa técnica.
- Aprove pequeno e cedo, comente issues maiores em PR separado.

### Como receber bem
- Não defenda — escute. O código não é você.
- Se discorda, explique o trade-off; se mesmo assim divergem, decida e
  documente.
- Agradeça revisões cuidadosas em público, isso constrói cultura.

---

## 12. Comunicação >>> código

Você pode escrever o melhor código do mundo. Se não consegue:
- explicar a um leigo o que ele faz,
- defender em meeting por que essa abordagem,
- escrever um RFC/ADR claro,
- mentorar alguém menos experiente,

…você não é sênior, é especialista. Sênior comunica.

### Ferramentas
- **Diagramas** (excalidraw, mermaid). Vale 1000 linhas de doc.
- **ADR (Architecture Decision Records)** — registre POR QUÊ decidiram cada
  arquitetura. O futuro agradece.
- **README operacional**: como rodar, como debugar, como deployar.
- **Status updates assíncronos**: o que fiz, o que vou fazer, onde travei.

### Princípio
**Não suma.** Em time, dev sênior reporta progresso e bloqueios proativamente.
Silêncio = risco oculto.

---

## 13. Pense em sistemas, não em arquivos

Júnior pensa em "como faço esse arquivo funcionar".
Pleno pensa em "como faço esse módulo funcionar".
Sênior pensa em "como esse módulo se encaixa no sistema, e o que acontece se
eu mudar/quebrar/remover ele".

### Perguntas-chave
- Quem chama esse código? Quem é chamado por ele?
- O que acontece se este serviço cair?
- Qual é o blast radius (raio de explosão) dessa mudança?
- Como observamos o comportamento em produção?

### Conceitos transferíveis
- **Acoplamento e coesão** (alto/baixo).
- **Lei de Conway**: a arquitetura tende a refletir a estrutura organizacional.
- **Loose coupling, high cohesion** vale tanto pra classes quanto pra
  microserviços.
- **Boundaries claras**: cada componente tem responsabilidade nítida e contrato
  explícito.

---

## 14. Decisões reversíveis vs irreversíveis

Bezos chama de "two-way doors" (portas de duas vias) e "one-way doors".

| Reversível (decida rápido)             | Irreversível (decida com cuidado)            |
| -------------------------------------- | -------------------------------------------- |
| Escolha de biblioteca menor            | Schema de DB em produção                     |
| Estilo de naming                       | Formato de API pública                       |
| Estrutura de pastas                    | Migração de banco                            |
| Refactor interno                       | Mudança que vaza pra clientes externos       |
| Texto de UI                            | Modelagem de domínio fundamental             |

Sênior gasta seu cérebro nas one-way doors. Two-way doors, decide e segue —
errar é barato.

---

## 15. Saber dizer "não" e "depende"

Junior aceita tudo pra parecer prestativo. Sênior negocia escopo.

### Padrões de resposta
- **"Sim, e isso vai custar X em [tempo/qualidade/escopo]."**
- **"Sim, mas precisamos cortar Y antes."**
- **"Não no formato pedido, mas conseguimos resolver o problema com Z."**
- **"Antes de responder, me ajuda a entender [premissa]?"**

Dizer "sim" para tudo destrói o time. Dizer "não" sem alternativa também.
Sênior abre opções.

---

## 16. Ergonomia de desenvolvimento

Bom dev sênior cuida do **tempo de feedback** dele e do time.

### Métricas a defender
- Tempo de build local: idealmente < 30s.
- Tempo de teste: < 5min pra suite completa, < 30s pra unit.
- Tempo de deploy de DEV: < 10min.
- Linter automático no save.
- CI verde em < 15min.

Se essas estão ruins, **trabalhe nelas**. Cada minuto perdido nelas se
multiplica por todos os devs, todos os dias.

---

## 17. Aprendizado contínuo (sem virar refém de hype)

### O que funciona
- **Fundamentos não envelhecem.** Algoritmos, redes, SO, DB, Git, tipos,
  concorrência. Investir aí compõe juros.
- **Princípios > frameworks.** SOLID, DRY, KISS, YAGNI, separation of concerns
  valem em qualquer linguagem.
- **Leia código alheio.** Open source maduro (Linux kernel, Postgres, React)
  ensina mais que tutorial.
- **Escreva.** Blog, gist, doc interna. Forçar-se a explicar revela buracos.

### O que não funciona
- Trocar de framework toda semana porque saiu novo.
- Confundir "sei usar a lib X" com "entendo o problema que X resolve".
- Twitter como única fonte. Algoritmo otimiza por engajamento, não por verdade.

### Hábito mínimo
- Releases notes da sua linguagem/runtime.
- 1 livro técnico por trimestre.
- 1 post denso por semana de fonte confiável (TkDodo, Martin Fowler, Hillel
  Wayne, Brendan Gregg, Gergely Orosz).

---

## 18. Saúde mental e sustentabilidade

Burnout e crunch destroem mais carreiras do que falta de skill.

### O que sênior faz
- Limites claros: hora de parar é hora de parar.
- Escala dor — não ser herói solitário. Pedir ajuda é sinal de força.
- Documenta o que sabe, pra não virar bus factor 1.
- Cuida de júnior — todo sênior já foi júnior carregado por outro sênior.

### Contra dogma
- 10x dev, "rockstar", "ninja" são marketing. Time bom > indivíduo brilhante.
- Trabalhar 80h/semana **não** te torna sênior; te torna esgotado.

---

## 19. Heurísticas que cabem num post-it

Mantenha visíveis. Tatuagem opcional.

- **YAGNI** — You Aren't Gonna Need It.
- **DRY** — Don't Repeat Yourself (mas não ao ponto de inventar abstração com 1 uso).
- **KISS** — Keep It Simple, Stupid.
- **SoC** — Separation of Concerns.
- **Boy Scout Rule** — deixe o código mais limpo do que encontrou.
- **Make it work, make it right, make it fast** — nessa ordem.
- **Premature optimization is the root of all evil.**
- **Fail fast.** Erros próximos da causa, não 5 camadas abaixo.
- **Composition over inheritance.**
- **Convention over configuration** (quando o time concorda na convenção).
- **Make the change easy, then make the easy change.** — Kent Beck.
- **There are no solutions, only trade-offs.** — Thomas Sowell.

---

## 20. Pergunta-teste de senioridade

Quando estiver em dúvida se sua decisão é "sênior", responda em voz alta:

> Se eu tivesse que defender essa escolha por 5 minutos, em frente a 3
> engenheiros céticos, sem usar a palavra "porque sempre se faz assim",
> conseguiria?

Se sim, prossiga. Se não, pare e pense de novo.

---

## Para outros papéis específicos

Os mesmos princípios viram dialeto local:

### Backend
- Modelar domínio antes de tabela. DDD não é hype — é ferramenta.
- Idempotência em endpoints que mutam.
- Migrations versionadas, sempre.
- Pensar em paginação desde o dia 1 — listas crescem.
- Logging estruturado + correlation id em request.

### Frontend
- Loading, error, empty, success — desenhe os 4 estados ANTES do happy path.
- Acessibilidade (a11y) não é opcional.
- Performance percebida ≠ performance real (skeleton > spinner).
- Mobile first sempre que faz sentido.
- Estado de URL é estado válido — busca, filtro, paginação devem ir pra URL.

### Mobile
- Tamanho de bundle/binário é dor.
- Conexão flaky é caso comum, não exceção.
- Background tasks têm regras de OS — conheça.
- Lifecycle de tela é sutil; teste rotação, suspend/resume.

### Dados
- Garbage in, garbage out. Validação de fonte é metade do trabalho.
- Lineage e reproducibilidade > performance bruta.
- Schema evolution é arte; pense em versionamento desde o início.
- Privacy by design (LGPD/GDPR).

### DevOps/SRE
- Toil é inimigo. Automatize o que repete.
- Observability = logs + metrics + traces. Os três.
- SLO antes de SLA. Decida o que é "bom o bastante" com produto.
- Postmortems sem culpa. Aprender > apontar.

### Segurança
- Threat model em todo design relevante.
- Defesa em profundidade.
- Fail closed (negar por padrão), não fail open.

---

## Bibliografia mínima (independente de stack)

Livros que todo sênior eventualmente lê:

| Livro                                              | Autor                       |
| -------------------------------------------------- | --------------------------- |
| **The Pragmatic Programmer**                       | Hunt & Thomas               |
| **Clean Code** (com ressalvas)                     | Robert Martin               |
| **Refactoring**                                    | Martin Fowler               |
| **Domain-Driven Design** (Blue Book)               | Eric Evans                  |
| **Designing Data-Intensive Applications**          | Martin Kleppmann            |
| **The Phoenix Project / The Unicorn Project**      | Gene Kim                    |
| **A Philosophy of Software Design**                | John Ousterhout             |
| **Working Effectively with Legacy Code**           | Michael Feathers            |
| **The Mythical Man-Month**                         | Fred Brooks                 |
| **Site Reliability Engineering** (gratuito Google) | Google                      |
| **Staff Engineer**                                 | Will Larson                 |
| **An Elegant Puzzle**                              | Will Larson                 |

E os blogs:
- [Martin Fowler](https://martinfowler.com/) — refactoring, microservices, padrões.
- [Hillel Wayne](https://www.hillelwayne.com/) — formalismo, computer science aplicada.
- [Brendan Gregg](https://www.brendangregg.com/) — performance, Linux.
- [The Pragmatic Engineer (Gergely Orosz)](https://www.pragmaticengineer.com/) — carreira, big tech.
- [High Scalability](http://highscalability.com/) — case studies.
- [Increment](https://increment.com/) — magazines temáticos.

---

## Fechamento

Sênior é um **modo de pensar**, não um título. Tem dev de 3 anos pensando como
sênior, e dev de 15 anos ainda no automático. A diferença está nas perguntas
que se faz antes de codar e na quantidade de "depende" que diz com confiança.

Use este documento como espelho. Em cada PR, em cada decisão de design,
pergunte:

- Estou otimizando para a próxima pessoa?
- Entendi o problema?
- Pesei trade-offs, ou só copiei receita?
- Estou escrevendo o mínimo de código?
- O estado está bem modelado?
- E quando der errado, o que acontece?
- Consigo medir o resultado?
- Consigo defender essa escolha?

Se a resposta for "sim" para a maioria, com humildade, você está pensando
como sênior — independente de quanto tempo de carreira tem.
