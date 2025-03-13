import { Buffer } from 'buffer';
import VueCookieAcceptDecline from 'vue-cookie-accept-decline';
import Jazzicon from 'vue3-jazzicon/src/components';
import config from '../package.json';
import { LS_KEYS } from '~/lib/values/general.values';

export default defineNuxtPlugin(nuxtApp => {
  if (typeof window !== 'undefined') {
    window.Buffer = Buffer;
    versionCheck();

    /** Set API base URL */
    const appConfig = useRuntimeConfig();
    $api.setBaseUrl(appConfig.public.apiUrl);

    /** Cookie notice */
    nuxtApp.vueApp.component('vue-cookie-accept-decline', VueCookieAcceptDecline);

    /** Jazz icon */
    nuxtApp.vueApp.component('jazzicon', Jazzicon);
  }
});

function versionCheck() {
  const version = config.version || '1.0.0';

  if (localStorage) {
    const userVersion = localStorage.getItem(LS_KEYS.APP_VERSION);
    if (!userVersion) {
      localStorage.setItem(LS_KEYS.APP_VERSION, version);
    } else if (version > userVersion) {
      localStorage.setItem(LS_KEYS.APP_VERSION, version);
      window.location.reload();
    }
  }
}
