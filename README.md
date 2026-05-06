# ERP da Loja — Projeto Educacional React + Spring Boot

Projeto didático de um ERP simples (categorias, produtos, clientes, vendas) com:

- **Frontend**: React 19 + TypeScript + Vite + Mantine v7 + TanStack Query + react-hook-form + zod + i18next + ESLint 9.
- **Backend**: Spring Boot 4 + Java 21 + Spring Data JPA + Flyway + MapStruct + JWT + Swagger + Bean Validation.
- **Banco**: PostgreSQL 18.

> Convenção de nomenclatura: **domínio em PT-BR**, **classificadores em inglês** (`Service`, `Controller`, `Repository`, `Mapper`, `Provider`, `Modal`, `Field`, ...).

---

## Pré-requisitos

| Ferramenta   | Versão     |
|--------------|------------|
| Node.js      | 22 LTS     |
| JDK          | 21         |
| Maven        | 3.9+       |
| PostgreSQL   | 18         |

---

## Subindo o backend

```bash
# 1) crie o banco
psql -U postgres -c "CREATE DATABASE erp_loja;"

# 2) ajuste credenciais em backend/src/main/resources/application.yml se necessário

# 3) rode (Flyway aplica V1__init_schema.sql automaticamente)
cd react-project/backend
mvn spring-boot:run
```

- API: <http://localhost:8080>
- Swagger UI: <http://localhost:8080/swagger-ui.html>
- Health: <http://localhost:8080/actuator/health>

No primeiro startup, é criado o usuário admin: **`admin / admin123`**.

---

## Subindo o frontend

```bash
cd react-project/frontend
npm install
npm run dev
```

App: <http://localhost:5173>

Outros scripts:

```bash
npm run lint          # ESLint
npm run lint:fix      # ESLint com auto-fix
npm run format        # Prettier
npm run typecheck     # tsc --noEmit
npm run build         # build de produção
```

---

## Para quem vem de Vue 3 / Quasar

| Vue/Quasar                                | React                                          |
|-------------------------------------------|------------------------------------------------|
| `ref()` / `reactive()`                    | `useState()`                                   |
| `computed()`                              | `useMemo()`                                    |
| `watch()` / `onMounted()`                 | `useEffect()`                                  |
| `defineProps<{}>()`                       | `interface Props {}` + parâmetros do componente|
| `<template>`                              | JSX (return)                                   |
| `<slot>`                                  | `children`                                     |
| `<slot name="x">`                         | uma prop nomeada (ex.: `rodape`)               |
| `<Teleport to="body">`                    | Portal (Mantine `<Modal>` já usa)              |
| `provide` / `inject`                      | Context API (`createContext` + `useContext`)   |
| Pinia store                               | Zustand / Context API                          |
| `vue-router` `beforeEach`                 | `<PrivateRoute>` envolvendo a rota             |
| `<router-view>`                           | `<Outlet />` (React Router)                    |
| Composables (`useXxx.ts`)                 | Custom hooks (`useXxx.ts`)                     |
| `q-input` `:rules="[...]"`                | `Controller` + zod schema                      |
| `vue-i18n` `$t('chave')`                  | `useTranslation().t('chave')`                  |
| `@vue-query` `useQuery`                   | `@tanstack/react-query` `useQuery`             |
| `errorCaptured` hook                      | Error Boundary (componente de classe)          |
| `defineAsyncComponent`                    | `React.lazy()` + `<Suspense>`                  |

---

## Glossário rápido de Hooks

- **useState** — estado local de um componente.
- **useEffect** — efeito colateral (fetch, subscribe, timer). Roda após render.
- **useMemo** — memoriza um valor calculado (≈ `computed`).
- **useCallback** — memoriza uma função (referência estável).
- **useRef** — referência mutável que não dispara re-render; também acessa DOM.
- **useContext** — consome um Context.
- **Custom hooks** — qualquer função `useXxx` que combina os anteriores.

---

## Estrutura de pastas

```
react-project/
├── backend/                    # Spring Boot 4 + Java 21
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/loja/erp/
│       │   ├── ErpApplication.java
│       │   ├── config/         # Security, JWT, OpenAPI
│       │   ├── exception/      # Handler global RFC 7807
│       │   ├── common/         # PaginaDto
│       │   ├── auth/           # Login (JWT)
│       │   ├── usuario/
│       │   ├── categoria/      # entidade + repo + service + controller + mapper + specs + dto
│       │   ├── produto/
│       │   ├── cliente/
│       │   ├── venda/
│       │   └── dashboard/
│       └── resources/
│           ├── application.yml
│           ├── schema.sql                        # referência manual
│           └── db/migration/V1__init_schema.sql  # Flyway
└── frontend/                   # React 19 + TS + Vite
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig*.json
    ├── eslint.config.js
    ├── .prettierrc
    ├── postcss.config.cjs
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── i18n/                         # react-i18next (pt-BR + en-US)
        ├── types/api.ts                  # DTOs tipados
        ├── api/                          # services HTTP (axios)
        ├── context/AuthContext.tsx       # Context API
        ├── hooks/useAberturaModal.ts     # custom hook
        ├── components/
        │   ├── PrivateRoute.tsx
        │   ├── ErrorBoundary.tsx
        │   ├── LayoutPrincipal.tsx
        │   ├── ui/                       # Modal, PageHeader, DataTable
        │   ├── fields/                   # FormProvider, Text/Number/Currency/Date/SelectField
        │   └── modals/                   # Categoria/Produto/Cliente/Venda + Confirmação
        ├── pages/                        # Login, Dashboard, Categorias, Produtos, Clientes, Vendas
        └── styles/global.css
```

---

## Endpoints REST (resumo)

| Método | Rota                          | Descrição                                     |
|--------|-------------------------------|-----------------------------------------------|
| POST   | `/api/auth/login`             | Autentica e devolve JWT                       |
| GET    | `/api/dashboard/resumo`       | Totais para o dashboard                       |
| GET    | `/api/categorias?page=0&size=10&sort=nome,asc&nome=...` | Listagem paginada com filtros |
| GET    | `/api/categorias/todas`       | Todas (para selects)                          |
| POST   | `/api/categorias`             | Cria                                          |
| PUT    | `/api/categorias/{id}`        | Atualiza                                      |
| DELETE | `/api/categorias/{id}`        | Remove                                        |
| ...    | `/api/produtos`, `/api/clientes`, `/api/vendas` | Mesmo padrão (com filtros próprios) |

Todos os endpoints (exceto `/api/auth/**` e Swagger) exigem header `Authorization: Bearer <token>`.

---

## Filtros + paginação (Specifications)

O backend usa `JpaSpecificationExecutor` para compor filtros dinâmicos (ver `CategoriaSpecs`, `ProdutoSpecs`, etc). O frontend envia tudo via query string padrão Spring:

```
GET /api/produtos?page=0&size=10&sort=nome,asc&nome=cad&categoriaId=3&precoMin=10&precoMax=200
```

A resposta vem no envelope `PaginaDto<T>`:

```json
{
  "conteudo": [...],
  "pagina": 0,
  "tamanho": 10,
  "totalElementos": 42,
  "totalPaginas": 5,
  "ultima": false
}
```
