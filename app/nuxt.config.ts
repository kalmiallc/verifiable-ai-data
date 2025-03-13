import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import { getAppConfig } from './lib/utils';
import { AppEnv } from './lib/types/config';

const env = process.env.ENV || process.env.RUN_ENV || process.env.NODE_ENV;
const appConfig = getAppConfig(env);

const meta = {
  lang: 'en',
  title: 'Verifiable AI data',
  description: 'Verifiable AI data application.',
  url: appConfig.url,
  image: `${appConfig.url}/og.png`,
};

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  ssr: false,

  build: {
    transpile: process.env.NODE_ENV === AppEnv.PROD ? ['naive-ui', '@juggle/resize-observer'] : [''],
  },
  components: ['~/components', '~/components/general/', '~/components/parts/'],
  devtools: { enabled: true },
  experimental: {
    payloadExtraction: false,
    viewTransition: true,
    renderJsonPayloads: true,
  },
  imports: {
    dirs: ['composables/', 'stores/', 'lib/utils'],
  },
  modules: [
    '@vueuse/nuxt',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    'nuxt-icons',
    '@nuxtjs/i18n',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    'nuxtjs-naive-ui',
  ],
  nitro: {
    compressPublicAssets: true,
    minify: true,
  },
  runtimeConfig: { public: appConfig },
  typescript: { shim: false },
  vite: {
    plugins: [
      AutoImport({
        imports: [
          {
            'naive-ui': ['useMessage'],
          },
        ],
      }),
      Components({
        resolvers: [NaiveUiResolver()],
      }),
      {
        name: 'vite-plugin-glob-transform',
        transform(code: string, id: string) {
          if (id.includes('nuxt-icons')) {
            return code.replace(/as:\s*['"]raw['"]/g, 'query: "?raw", import: "default"');
          }
          return code;
        },
      },
    ],
    optimizeDeps: {
      include: process.env.NODE_ENV === AppEnv.DEV ? ['color', 'mersenne-twister', 'naive-ui'] : [],
    },
  },

  app: {
    head: {
      htmlAttrs: {
        lang: meta.lang,
      },

      title: meta.title,
      titleTemplate: `%s - ${meta.title}`,
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',

      meta: [
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#070707' },
        { name: 'description', content: meta.description, hid: 'description' },
        { name: 'og:title', content: meta.title, hid: 'og:title' },
        { name: 'og:description', content: meta.description, hid: 'og:description' },
        { name: 'og:url', content: meta.url, hid: 'og:url' },
        { name: 'og:image', content: meta.image },
        { name: 'og:type', content: 'website' },
        { name: 'twitter:title', content: meta.title, hid: 'twitter:title' },
        { name: 'twitter:description', content: meta.description, hid: 'twitter:description' },
        { name: 'twitter:url', content: meta.url, hid: 'twitter:url' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: meta.image },
        { name: 'twitter:creator', content: meta.twitter },
        { name: 'twitter:site', content: meta.twitter },
        {
          'http-equiv': 'Content-Security-Policy',
          content:
            "default-src *; font-src 'self' data:; img-src * data:; script-src 'self' 'unsafe-inline' 'unsafe-eval' *; style-src 'self' 'unsafe-inline' *",
        },
      ],

      link: [{ rel: 'icon', type: 'image/png', href: '/logo.svg' }],

      script: [],
    },
  },

  i18n: {
    lazy: true,
    strategy: 'no_prefix',
    defaultLocale: 'en-US',
    detectBrowserLanguage: false,
    langDir: 'i18n',
    vueI18n: 'i18n/config',
    compilation: { strictMessage: false, escapeHtml: false },
    locales: [
      {
        code: 'en-US',
        name: 'English',
        file: 'en/index.ts',
      },
    ],
  },

  googleFonts: {
    useStylesheet: true,
    display: 'swap',
    download: true,
    families: {
      Inter: {
        wght: [400, 500, 600, 700],
      },
    },
  },
  tailwindcss: { cssPath: '~/assets/css/tailwind.css' },
});
