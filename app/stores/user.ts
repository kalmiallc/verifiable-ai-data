import { useDisconnect } from '@wagmi/vue';
import { defineStore } from 'pinia';
import Endpoints from '~/lib/values/endpoints';
import { PARAMS_ALL_ITEMS, WebStorageKeys } from '~/lib/values/general.values';

export const useUserStore = defineStore('user', {
  state: () => ({
    jwt: '',
    loadingProfile: false,
    notifications: {
      loading: false,
      items: [] as NotificationInterface[],
    },
    promises: {
      profile: null as any,
    },
    collateralToken: {
      balance: BigInt(0),
      parsedBalance: '0.0',
      decimals: 6,
      symbol: '',
      loaded: false,
      loading: false,
    },

    token: {
      base: {
        allowance: BigInt(0),
        balance: BigInt(0),
        symbol: '',
      },
      bsc: {
        allowance: BigInt(0),
        balance: BigInt(0),
        symbol: '',
      },
      moonbeam: {
        allowance: BigInt(0),
        balance: BigInt(0),
        symbol: '',
      },
    },
    user: {} as UserInterface,
  }),
  getters: {
    loggedIn(state) {
      return !!state.jwt;
    },
    hasNotifications(state) {
      return Array.isArray(state.notifications.items) && state.notifications.items.length > 0;
    },
  },
  actions: {
    logout() {
      try {
        this.$reset();
        $api.clearToken();

        const { disconnect } = useDisconnect();
        disconnect();
      } catch (e) {}
    },

    saveUser(userData: AuthInterface) {
      this.user = { ...userData };

      if (userData.token) {
        this.setUserToken(userData.token);
      }
    },

    setUserToken(token: string) {
      this.jwt = token;
      $api.setToken(token);
    },

    /**
     * API calls
     */
    initUser() {
      if (this.jwt) {
        this.setUserToken(this.jwt);
        this.promises.profile = this.getUserData();
      }
    },

    async getUserData() {
      this.loadingProfile = true;
      try {
        const res = await $api.get<UserResponse>(Endpoints.me);

        if (res.data) {
          this.saveUser(res.data);
        }
        setTimeout(() => {
          this.loadingProfile = false;
        }, 10);

        return res;
      } catch (error) {
        /** On error - logout */
        this.logout();

        setTimeout(() => {
          this.loadingProfile = false;
        }, 700);
        return null;
      }
    },

    /** Notifications */
    async getNotifications(force = false) {
      if (this.hasNotifications || !force) return;

      this.notifications.loading = true;
      try {
        const params = parseArguments({ limit: PARAMS_ALL_ITEMS.limit });
        const { data } = await $api.get<NotificationsResponse>(Endpoints.notification, params);
        this.notifications.items = data.items;
      } catch (error: any) {
        this.notifications.items = [] as NotificationInterface[];

        /** Show error message */
        window.$message.error(apiError(error));
      } finally {
        this.notifications.loading = false;
      }
    },
  },
  persist: {
    key: WebStorageKeys.USER_STORE,
    storage: sessionStorage,
    pick: ['jwt', 'notifications', 'user'],
  },
});
