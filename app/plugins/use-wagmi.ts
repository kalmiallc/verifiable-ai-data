import { VueQueryPlugin } from '@tanstack/vue-query';
import { createConfig, createStorage, http, WagmiPlugin } from '@wagmi/vue';
import { flareTestnet, songbird, type Chain } from '@wagmi/vue/chains';
import { coinbaseWallet, injected, metaMask } from '@wagmi/vue/connectors';
import { AppEnv } from '~/lib/types/config';

export default defineNuxtPlugin(nuxtApp => {
  const chains: readonly [Chain, ...Chain[]] =
    useRuntimeConfig().public.ENV === AppEnv.PROD ? [songbird] : [flareTestnet];

  const transports = chains.reduce((acc, chain) => {
    acc[chain.id] = http();
    return acc;
  }, {});

  const wagmiConfig = createConfig({
    chains,
    connectors: [
      injected(),
      metaMask({
        dappMetadata: {
          name: 'Verifiable AI data',
          iconUrl: '/logo.svg',
        },
      }),
      coinbaseWallet({ appName: 'Verifiable AI data', appLogoUrl: '/logo.svg' }),
    ],
    multiInjectedProviderDiscovery: false,
    storage: createStorage({ storage: window.sessionStorage }),
    transports,
  });

  nuxtApp.provide('wagmiConfig', wagmiConfig);
  nuxtApp.vueApp.use(WagmiPlugin, { config: wagmiConfig });
  nuxtApp.vueApp.use(VueQueryPlugin);
});
