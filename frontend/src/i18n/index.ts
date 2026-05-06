/**
 * Configuração do i18next.
 *
 * 🔁 PARALELO COM VUE/QUASAR:
 *  - Em Vue, o equivalente é o `vue-i18n` com `app.use(i18n)`.
 *  - Aqui inicializamos o i18next antes de renderizar o app.
 *
 * 💡 POR QUE i18next:
 *  - Padrão de fato no ecossistema React. Suporta detecção automática de idioma,
 *    namespaces, pluralização, interpolação e fallback.
 *
 * 🌍 OUTROS CASOS DE USO:
 *  - Qualquer app que precise suportar múltiplos idiomas. Mesmo que comece
 *    monolíngue, instalar i18next desde o início evita refatoração futura.
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ptBR from './pt-BR.json';
import enUS from './en-US.json';

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'pt-BR',
    supportedLngs: ['pt-BR', 'en-US'],
    interpolation: { escapeValue: false }, // o React já escapa por padrão
    resources: {
      'pt-BR': { translation: ptBR },
      'en-US': { translation: enUS },
    },
  });

export default i18n;
