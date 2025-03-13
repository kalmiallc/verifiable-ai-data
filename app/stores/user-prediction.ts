import { defineStore } from 'pinia';
import type { TableFilters } from '~/lib/types/config';
import Endpoints from '~/lib/values/endpoints';

export const useUserPredictionStore = defineStore('userPrediction', {
  state: () => ({
    active: {} as UserPredictionInterface,
    items: [] as UserPredictionInterface[],
    loading: false,
    pagination: createPagination(),
    sorter: null,
    filters: {
      search: {
        show: true,
        value: null,
      },
    } as TableFilters,
  }),
  actions: {
    resetFilters() {
      this.filters.search.value = null;
    },

    async fetch(args: FetchParams = {}): Promise<UserPredictionInterface[]> {
      syncFilters(this.filters, args);
      this.loading = true;

      try {
        const res = await $api.get<UserPredictionsResponse>(Endpoints.userPredictions(), parseArguments(args));
        this.loading = false;
        this.items = res.data.items;
        this.pagination.itemCount = res.data.total;

        return this.items;
      } catch (error) {
        this.items = [];
        this.loading = false;
        this.pagination.itemCount = 0;
        window.$message.error(apiError(error));
        return [];
      }
    },
  },
});
