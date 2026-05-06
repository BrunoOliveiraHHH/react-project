# Rota de Estudo — Do zero ao sênior em React + TypeScript

> Este documento é um plano de estudos progressivo. Cada nível tem objetivos
> mensuráveis, conceitos a dominar e recursos (gratuitos e pagos). A ordem
> importa: pular fundamentos cobra caro depois.

---

## ⚠️ Ressalva importante

Você pediu para "ir direto pro sênior" e o código deste projeto reflete esse
nível. Mas:

- **Sênior** não é uma combinação de bibliotecas — é a capacidade de **decidir**
  qual abordagem cabe num contexto específico, **explicar trade-offs** e
  **comunicar arquitetura** com a equipe.
- Você só consegue isso depois de ter sentido na pele os problemas que cada
  padrão resolve. Aplicar `useCrudMutation` sem antes ter sofrido com
  `try/catch` repetido é só copiar receita.

**Recomendação real:** estude na ordem abaixo, mesmo que pareça óbvio. Skipar
fundamentos costuma virar débito técnico no Code Review depois.

---

## Nível 0 — Pré-requisitos (não negociáveis)

### Objetivos
- JavaScript moderno fluente: arrow, destructuring, spread/rest, optional chaining,
  `Promise`, `async/await`, módulos ES.
- Entender o **event loop** o bastante para explicar por que `setTimeout(fn, 0)`
  roda depois de microtasks.
- Tipos básicos do TypeScript: `interface`, `type`, generics, `unknown` vs `any`,
  union/intersection, `keyof`, `typeof`.
- Git: branches, rebase, conflito, PR.

### Recursos gratuitos
- [JavaScript.info](https://javascript.info/) — referência completíssima.
- [MDN Web Docs](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript) — fonte canônica.
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) — oficial.
- [Total TypeScript Beginner](https://www.totaltypescript.com/beginners-typescript) — Matt Pocock, gratuito.
- [The Odin Project — Foundations](https://www.theodinproject.com/paths/foundations/courses/foundations) — gratuito, hands-on.

### Recursos pagos
- [Curso JavaScript Completo (Origamid)](https://www.origamid.com/curso/javascript-completo-es6) — ~R$ 250.
- [JavaScript: The Hard Parts (Frontend Masters)](https://frontendmasters.com/courses/javascript-hard-parts-v2/) — assinatura.

---

## Nível 1 — React Fundamentos

### Objetivos
- Componentes funcionais e JSX (saber explicar por que JSX existe).
- `useState`, `useEffect`, `useRef`, `useMemo`, `useCallback`, `useContext`.
- Eventos sintéticos, formulários controlados vs uncontrolled.
- Renderização condicional, listas com `key` (sabendo por que `index` é ruim).
- Lifting state up; "data down, events up".
- Composição via `children` e props (em vez de herança).

### Critério de saída
- Construir um TodoApp com filtros e persistência em `localStorage` sem ler
  documentação.
- Explicar quando usar `useMemo` (e por que normalmente é desnecessário).

### Recursos gratuitos
- [React Docs (nova) — react.dev](https://react.dev/learn) — **comece por aqui**, é a melhor doc do ecossistema.
- [Rocketseat — Trilha React (Ignite)](https://www.rocketseat.com.br/) — versão gratuita Discover/Explorer.
- [React Brasil no YouTube — Lucas Mogari, Rocketseat, Filipe Deschamps](https://www.youtube.com/results?search_query=react+brasil).
- [Scrimba — Learn React (free tier)](https://scrimba.com/learn/learnreact).

### Recursos pagos
- [Epic React v2 (Kent C. Dodds)](https://www.epicreact.dev/) — referência mundial, ~US$ 600 com workshops em vídeo.
- [Rocketseat Ignite — Trilha React](https://www.rocketseat.com.br/) — assinatura mensal.
- [Frontend Masters — Complete Intro to React (Brian Holt)](https://frontendmasters.com/courses/complete-react-v9/).
- [Origamid — React Completo](https://www.origamid.com/curso/react-completo) — em PT-BR.

---

## Nível 2 — TypeScript no React

### Objetivos
- Tipar componentes, props, eventos, refs.
- Generics em componentes (ex.: `<DataTable<Produto> />`).
- `as const`, `satisfies`, discriminated unions.
- Inferência via `z.infer<typeof schema>`.

### Critério de saída
- Criar um componente `<Select<T> options={...} />` 100% tipado, sem `any`.

### Recursos gratuitos
- [Total TypeScript — React with TypeScript](https://www.totaltypescript.com/tutorials/react-with-typescript) — gratuito.
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/) — referência.
- [Matt Pocock no YouTube](https://www.youtube.com/@mattpocockuk) — vídeos curtos sobre tipos avançados.

### Recursos pagos
- [Total TypeScript (Matt Pocock) — Pro](https://www.totaltypescript.com/) — workshops aprofundados, ~US$ 500.

---

## Nível 3 — Ferramentas modernas (este projeto)

### Objetivos
Dominar a stack que usamos aqui. Para cada item, saiba **quando NÃO usar**:

- **Vite** — bundler. Saber sobre HMR, env vars (`import.meta.env`), build.
- **React Router v7** — rotas, nested routes, loaders, guards via componente.
- **TanStack Query** — server state, queryKeys, invalidação, optimistic updates,
  `keepPreviousData`/`placeholderData`, `staleTime` vs `gcTime`.
- **react-hook-form + zod** — `Controller`, `useFormContext`, schemas tipados.
- **Mantine v7** — sistema de design, Combobox, hooks (`useDisclosure`,
  `useDebouncedValue`).
- **Zustand** — quando preferir a Context API.
- **i18next** — keys hierárquicas, namespaces, pluralização.
- **axios** — interceptors, cancelamento (AbortController).
- **ESLint flat config** — saber escrever uma regra simples.

### Critério de saída
- Saber explicar por que `staleTime: 0` (default) causa refetch agressivo.
- Saber por que `Controller` existe (e quando `register` basta).

### Recursos gratuitos
- [TanStack Query Docs](https://tanstack.com/query/latest/docs/framework/react/overview) — leia o tutorial inteiro.
- [TkDodo's blog — Practical React Query](https://tkdodo.eu/blog/practical-react-query) — **leitura obrigatória**, autor do projeto.
- [react-hook-form Docs](https://react-hook-form.com/get-started) + exemplos com Zod.
- [Mantine Docs](https://mantine.dev/getting-started/).
- [Vite Guide](https://vitejs.dev/guide/).

### Recursos pagos
- [Bytes Newsletter (Tyler McGinnis) — uidotdev/react-query](https://ui.dev/c/react-query) — curso pago focado.
- [TkDodo — React Query workshops](https://tkdodo.eu/blog/) — links nos posts.

---

## Nível 4 — Padrões e arquitetura (a virada para sênior)

### Objetivos
- **Composition over configuration** — props bem desenhadas em vez de N flags.
- **Compound components** (`<Tabs><Tabs.List/><Tabs.Panel/></Tabs>`).
- **Render props** e **custom hooks** como mecanismos de reuso.
- **Inversion of Control** — quem decide o quê (controlled vs uncontrolled).
- **State machines** (XState) para fluxos complexos (login multi-step, wizards).
- **Feature-sliced architecture** (vertical slicing) vs camadas horizontais.
- **Error Boundaries** localizadas, fallback UIs.
- **Concurrent React**: `useTransition`, `useDeferredValue`, `<Suspense>`.
- **React Server Components** (Next.js App Router) — entender o paradigma.

### Critério de saída
- Identificar code smells em PRs alheios (`useEffect` que devia ser `useMemo`,
  estado derivado duplicado, prop drilling > 3 níveis, key como index, etc.).
- Refatorar um componente de 400 linhas em 3 menores sem regressão.

### Recursos gratuitos
- [Patterns.dev (Lydia Hallie & Addy Osmani)](https://www.patterns.dev/) — gratuito, padrões frontend modernos.
- [Kent C. Dodds blog](https://kentcdodds.com/blog) — busque por "compound components", "inversion of control".
- [TkDodo blog](https://tkdodo.eu/blog/) — toda a série.
- [Robin Wieruch — React](https://www.robinwieruch.de/react/) — tutoriais aprofundados gratuitos.
- [Bulletproof React (alan2207)](https://github.com/alan2207/bulletproof-react) — repo de referência arquitetural.

### Recursos pagos
- [Epic React Pro (Kent C. Dodds)](https://www.epicreact.dev/) — workshops "Advanced React Patterns" + "Performance".
- [Frontend Masters — Advanced React Patterns (Kent C. Dodds)](https://frontendmasters.com/courses/advanced-react-patterns-v3/).
- [State Machines for the Modern Web (XState)](https://stately.ai/docs) — docs grátis; curso pago da Stately.

---

## Nível 5 — Performance & qualidade

### Objetivos
- Profilar com React DevTools Profiler.
- Saber ler um waterfall do Network e identificar gargalos.
- Code splitting por rota e por componente (`React.lazy`).
- Virtualização de listas grandes (`@tanstack/react-virtual`).
- Web Vitals (LCP, INP, CLS) e como a stack do React os afeta.
- Bundle analysis (`vite-bundle-visualizer`).
- Acessibilidade (a11y): leitor de tela, navegação por teclado, ARIA.
- Testes: unit (Vitest) + integration (Testing Library) + e2e (Playwright).

### Critério de saída
- Reduzir LCP de 4s pra <2s num app real (medível).
- Escrever um teste E2E que roda em CI sem flakiness.

### Recursos gratuitos
- [web.dev — Learn Performance](https://web.dev/learn/performance) — Google, gratuito.
- [Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/).
- [Playwright Docs](https://playwright.dev/docs/intro).
- [a11yproject.com](https://www.a11yproject.com/) — checklist e patterns.

### Recursos pagos
- [Frontend Masters — Web Performance Fundamentals](https://frontendmasters.com/courses/web-perf/).
- [Testing JavaScript (Kent C. Dodds)](https://testingjavascript.com/) — referência.

---

## Nível 6 — Engenharia de produto (o que diferencia sênior+)

Aqui o React deixa de ser o protagonista.

### Objetivos
- Entender requisitos antes de codar; saber dizer "não" para escopo errado.
- Code review construtivo: distinguir preferência pessoal de problema real.
- Mentoria: explicar trade-offs sem dogmatismo.
- Observabilidade: logs estruturados, Sentry, Datadog RUM.
- Rollouts seguros: feature flags, canary, kill switches.
- Documentar decisões: ADRs (Architecture Decision Records).
- Comunicar com backend: contratos OpenAPI, versionamento de API.

### Recursos
- [Staff Engineer (Will Larson) — livro](https://staffeng.com/) — gratuito online + edição paga.
- [The Pragmatic Engineer (Gergely Orosz) — newsletter](https://www.pragmaticengineer.com/) — pago, mas posts livres muito ricos.
- [Engineering Ladders (Spotify, GitLab) — públicos](https://github.com/jorgef/engineeringladders).
- [Designing Data-Intensive Applications (Kleppmann)](https://dataintensive.net/) — livro, mais backend mas essencial.

---

## Cheat sheet de "código sênior" aplicado neste projeto

Comparações diretas no nosso código de coisas júnior → sênior:

| Junior                                            | Sênior (este projeto)                          |
| ------------------------------------------------- | ---------------------------------------------- |
| `queryKey: ['produtos', filtro, pagina]` literal  | [`queryKeys.produtos.lista(...)`](frontend/src/lib/queryKeys.ts) |
| `try/catch` em cada `mutation`                    | [`useCrudMutation`](frontend/src/hooks/useCrudMutations.ts) + [`mensagemDeErro`](frontend/src/lib/errorMessage.ts) |
| `useEffect` chamando `reset(form)` quando entidade muda | `<Formulario key={entidade?.id ?? 'novo'} />`  |
| `as Record<string, unknown>` em colunas           | Discriminated union `ColunaPorChave \| ColunaCustomizada` |
| `useState` + `useQuery` repetidos por página      | [`useListagemPaginada<TFiltro, TItem>`](frontend/src/hooks/useListagemPaginada.ts) |
| `new Intl.NumberFormat(...)` dentro do componente | [`lib/format.ts`](frontend/src/lib/format.ts) singletons |
| `enabled: aberto` em `useQuery` (refetch desnecessário) | `enabled: termo.length >= 3` (autocomplete) + `useDebouncedValue` |

---

## Plano semanal sugerido (3 meses)

| Semana | Foco                                                    |
| ------ | ------------------------------------------------------- |
| 1-2    | JS moderno + TS handbook                                |
| 3-4    | React Docs (react.dev) — ler todo o "Learn"             |
| 5-6    | TanStack Query + react-hook-form em projeto pessoal     |
| 7-8    | Refazer este projeto **sem olhar o código** — só docs   |
| 9-10   | Patterns.dev + Bulletproof React (estudar repo)         |
| 11     | Testing Library + Playwright em um app                  |
| 12     | Performance (DevTools Profiler) + Web Vitals            |

Ao final você consegue defender decisões arquiteturais em entrevista técnica e
aceitar/rejeitar PRs com argumentos sólidos. **Isso é sênior.**

---

## Contas para seguir (sinal alto, ruído baixo)

- [@TkDodo](https://twitter.com/TkDodo) — TanStack Query.
- [@mattpocockuk](https://twitter.com/mattpocockuk) — TypeScript.
- [@dan_abramov2](https://twitter.com/dan_abramov2) — React core.
- [@ryanflorence](https://twitter.com/ryanflorence) — React Router/Remix.
- [@kentcdodds](https://twitter.com/kentcdodds) — React + testes.
- [@_developit](https://twitter.com/_developit) — Preact, perf.
- [@addyosmani](https://twitter.com/addyosmani) — perf, patterns.
- [@aleclarson](https://twitter.com/aleclarson) — Mantine.

---

## Repositórios para ler (não copiar — entender)

- [bulletproof-react](https://github.com/alan2207/bulletproof-react) — referência arquitetural.
- [shadcn/ui](https://github.com/shadcn-ui/ui) — composição de componentes via copy-paste.
- [Cal.com](https://github.com/calcom/cal.com) — codebase real grande, Next.js.
- [taxonomy (shadcn)](https://github.com/shadcn-ui/taxonomy) — Next.js App Router moderno.
- [TanStack/query](https://github.com/TanStack/query) — código da própria lib.

---

**Última dica:** sênior **escreve menos código**, não mais. Quando estiver
tentado a adicionar abstração, pergunte: "que problema concreto isso resolve
**hoje** no projeto?". Se a resposta for "talvez no futuro", **não faça**.
