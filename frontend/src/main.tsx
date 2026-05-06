/**
 * main.tsx — Entry point da aplicação React.
 *
 * 📚 CONCEITO REACT: bootstrap do app via `ReactDOM.createRoot()` (API do React 18+
 * e padrão no React 19). Substitui o antigo `ReactDOM.render()`.
 *
 * 🔁 PARALELO COM VUE/QUASAR:
 *  - Em Vue 3 você faria:
 *      const app = createApp(App);
 *      app.use(router).use(pinia).mount('#app');
 *  - Aqui chamamos `createRoot(...).render(<App />)`. O `<StrictMode>` é o
 *    equivalente em espírito ao modo de desenvolvimento estrito do Vue:
 *    ele dispara o ciclo de vida 2x em DEV para detectar efeitos com side-effects
 *    inseguros (não roda em produção).
 *
 * 💡 POR QUE ESTA ABORDAGEM:
 *  - É a forma canônica e recomendada hoje. `StrictMode` ajuda a pegar bugs cedo.
 *
 * 🌍 OUTROS CASOS DE USO:
 *  - Quando criar múltiplas roots em uma mesma página (ex.: micro-frontends),
 *    você chama `createRoot` mais de uma vez em diferentes elementos.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './i18n';
import './styles/global.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';

const elementoRaiz = document.getElementById('root');

if (!elementoRaiz) {
  // Defesa em profundidade — em produção, isso jamais deveria acontecer.
  throw new Error('Elemento #root não encontrado em index.html');
}

createRoot(elementoRaiz).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
