/**
 * i18n configuration
 */
export default defineI18nConfig(() => ({
  legacy: false,
  defaultLocale: 'en-US',
  fallbackLocale: 'en-US',
  allowComposition: true,
  globalInjection: true,
  locales: [
    {
      code: 'en-US',
      name: 'English',
      file: 'en/index.ts',
    },
  ],
}));
