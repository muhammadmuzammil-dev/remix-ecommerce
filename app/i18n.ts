// export default {
//   supportedLngs: ['en', 'es', 'pt', 'pt-BR'],
//   fallbackLng: 'en',
//   // Disabling suspense is recommended
//   react: { useSuspense: false },
//   backend: {
//     loadPath: '../public/locales/{{lng}}/{{ns}}.json',
//   },
// };

export default {
  supportedLngs: ['en', 'es', 'pt', 'pt-BR'],
  fallbackLng: 'en',
  react: { useSuspense: false },
  backend: {
    // Ensure this path matches where your translation files are served from
    loadPath: '../public/locales/{{lng}}/{{ns}}.json',
  },
};

// import i18n from 'i18next';
// import HttpBackend from 'i18next-http-backend';

// // i18next configuration
// i18n
//   .use(HttpBackend) // Use the http backend
//   .init({
//     supportedLngs: ['en', 'es', 'pt', 'pt-BR'],
//     fallbackLng: 'en',
//     react: {
//       useSuspense: false // Recommended to disable suspense
//     },
//     backend: {
//       // Specify the path to your translation files.
//       // This should be a URL path if your files are hosted on a server.
//       // For local development, this might point to your public directory.
//       // For production, it should point to the appropriate URL.
//       loadPath: '../public/locales/{{lng}}/{{ns}}.json',
//     },
//     // additional options...
//   });

// export default i18n;
