/**
 * useAberturaModal — custom hook para controlar abertura/fechamento de modais.
 *
 * 📚 CONCEITO REACT: custom hook = qualquer função que comece com "use" e use
 * outros hooks. Permite encapsular lógica reutilizável.
 *
 * 🔁 PARALELO COM VUE/QUASAR:
 *  - É exatamente um composable Vue: `const { aberto, abrir, fechar } = useAberturaModal();`
 *  - Em Vue: `const aberto = ref(false); const abrir = () => aberto.value = true; ...`
 *
 * 💡 POR QUE EXTRAIR EM HOOK:
 *  - Páginas que abrem múltiplos modais (Produtos, Clientes...) repetem a mesma
 *    lógica. Hook elimina duplicação e padroniza a API.
 *
 * 🌍 OUTROS CASOS DE USO PARA CUSTOM HOOKS:
 *  - useDebounce, useLocalStorage, usePagination, useToggle, useFetch.
 *  - Sempre que duas ou mais componentes precisem da mesma lógica de estado.
 */
import { useCallback, useState } from 'react';

export interface ControleModal<T = unknown> {
  aberto: boolean;
  dados: T | null;
  abrir: (dados?: T) => void;
  fechar: () => void;
}

export function useAberturaModal<T = unknown>(): ControleModal<T> {
  const [aberto, setAberto] = useState(false);
  const [dados, setDados] = useState<T | null>(null);

  const abrir = useCallback((dadosIniciais?: T) => {
    setDados(dadosIniciais ?? null);
    setAberto(true);
  }, []);

  const fechar = useCallback(() => {
    setAberto(false);
    setDados(null);
  }, []);

  return { aberto, dados, abrir, fechar };
}
