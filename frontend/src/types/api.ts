/**
 * Tipos compartilhados que espelham os DTOs do backend.
 *
 * 🔁 PARALELO COM VUE/QUASAR:
 *  - Em Vue/Quasar, normalmente em `src/types/`. Mesma ideia aqui.
 *
 * 💡 POR QUE CENTRALIZAR:
 *  - Uma única fonte da verdade para todas as chamadas HTTP. Se o backend mudar
 *    o contrato, basta atualizar este arquivo e o TypeScript apontará todos os
 *    pontos a corrigir.
 */

// ----- Envelope de paginação devolvido pelo backend -----------------------
export interface Pagina<T> {
  conteudo: T[];
  pagina: number;
  tamanho: number;
  totalElementos: number;
  totalPaginas: number;
  ultima: boolean;
}

// ----- Auth ----------------------------------------------------------------
export interface LoginRequest {
  username: string;
  senha: string;
}
export interface LoginResponse {
  token: string;
  username: string;
  role: string;
}

// ----- Categoria -----------------------------------------------------------
export interface Categoria {
  id: number;
  nome: string;
  descricao?: string | null;
}
export interface CategoriaRequest {
  nome: string;
  descricao?: string;
}
export interface CategoriaFiltro {
  nome?: string;
  descricao?: string;
}

// ----- Produto -------------------------------------------------------------
export interface Produto {
  id: number;
  nome: string;
  sku: string;
  preco: number;
  estoque: number;
  categoriaId: number;
  categoriaNome: string;
}
export interface ProdutoRequest {
  nome: string;
  sku: string;
  preco: number;
  estoque: number;
  categoriaId: number;
}
export interface ProdutoFiltro {
  nome?: string;
  sku?: string;
  categoriaId?: number;
  precoMin?: number;
  precoMax?: number;
}

// ----- Cliente -------------------------------------------------------------
export interface Cliente {
  id: number;
  nome: string;
  cpf: string;
  email?: string | null;
  telefone?: string | null;
}
export interface ClienteRequest {
  nome: string;
  cpf: string;
  email?: string;
  telefone?: string;
}
export interface ClienteFiltro {
  nome?: string;
  cpf?: string;
  email?: string;
}

// ----- Venda ---------------------------------------------------------------
export interface Venda {
  id: number;
  clienteId: number;
  clienteNome: string;
  produtoId: number;
  produtoNome: string;
  quantidade: number;
  valorTotal: number;
  dataVenda: string;
}
export interface VendaRequest {
  clienteId: number;
  produtoId: number;
  quantidade: number;
}
export interface VendaFiltro {
  clienteId?: number;
  produtoId?: number;
  dataInicio?: string;
  dataFim?: string;
}

// ----- Dashboard -----------------------------------------------------------
export interface ResumoDashboard {
  totalProdutos: number;
  totalClientes: number;
  vendasHoje: number;
  faturamentoHoje: number;
}

// ----- Paginação enviada ao backend ---------------------------------------
export interface ParametrosPaginacao {
  page: number;
  size: number;
  sort?: string;
}
