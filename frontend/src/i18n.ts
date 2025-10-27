import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

i18n
  .use(HttpApi) // Loads translations from /public/locales
  .use(LanguageDetector) // Detects browser language
  .use(initReactI18next)
  .init({
    supportedLngs: ['en', 'de', 'zh'],

    fallbackLng: 'en',

    // Define your namespaces
    ns: ['common', 'auth', 'chat'],
    defaultNS: 'common',

    // Finds translations in /public/locales/[lang]/[namespace].json
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
  });

export default i18n;
