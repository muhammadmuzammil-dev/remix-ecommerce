import { RemixI18Next } from 'remix-i18next';
import i18n from '~/i18n'; // Your i18n configuration file
import HttpBackend from 'i18next-http-backend';
import { RemixI18NextOption } from 'remix-i18next/build/server';
import resourcesToBackend from 'i18next-resources-to-backend';
import { findLanguageJSON } from '~/languages.server';

const IS_CF_PAGES = process.env.NODE_ENV;

// Simplify the backend selection to always use HTTP Backend
export function getPlatformBackend() {
  return HttpBackend;
}

// Adjusting for API context to use resourcesToBackend if on CF Pages
// Otherwise, use HTTP Backend directly
export function getPlatformBackendApiCtx() {
  if (IS_CF_PAGES) {
    return resourcesToBackend(findLanguageJSON);
  }
  return HttpBackend;
}

// Adjust platform i18n config to use the selected backend
export async function platformAdapti18nConfig(config: RemixI18NextOption) {
  const backend = getPlatformBackendApiCtx();
  config.plugins = config.plugins ? [...config.plugins, backend] : [backend];
  return config;
}

// Initialization of RemixI18Next with adjusted config
export async function getI18NextServer() {
  return platformAdapti18nConfig({
    detection: {
      supportedLanguages: i18n.supportedLngs,
      fallbackLanguage: i18n.fallbackLng,
    },
    i18next: i18n, // Use the i18n configuration directly
    plugins: [], // Backend plugin is added in platformAdapti18nConfig
  }).then((config) => new RemixI18Next(config));
}

export async function getFixedT(request: Request) {
  return getI18NextServer().then((i18next) => i18next.getFixedT(request));
}
