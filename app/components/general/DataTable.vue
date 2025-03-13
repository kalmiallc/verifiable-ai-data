<template>
  <div class="card !px-6 !pt-8">
    <div class="flex-bc mb-4 gap-2 flex-wrap">
      <h2>{{ title }}</h2>
      <div class="flex gap-4 flex-wrap">
        <FormInputSearch
          v-if="filters?.search"
          v-model:value="filters.search.value"
          class="min-w-32 w-full xs:w-[12vw] max-w-xs"
        />
        <TableFilters v-if="filters" :filters="filters" :loading="loading" />
      </div>
    </div>
    <div v-if="items.length === 0 && !loading" class="w-full bg-grey-light p-6 mb-4 text-center">
      <n-empty description="No data" />
    </div>
    <n-data-table
      v-else
      v-bind="$attrs"
      :bordered="false"
      :columns="columns"
      :data="items"
      :loading="loading"
      :pagination="pagination"
      :row-props="() => rowProps"
      remote
      @update:page="(page: number) => getItems(page, pagination.pageSize)"
      @update:page-size="(pageSize: number) => getItems(1, pageSize)"
      @update:sorter="handleSorterChange"
    />

    <slot />
  </div>
</template>

<script lang="ts" setup>
import type { DataTableColumns, DataTableInst, DataTableSortState } from 'naive-ui';
import type { PropType } from 'vue';
import type { PaginationConfig, TableFilters } from '~/lib/types/config';
import { PAGINATION_LIMIT } from '~/lib/values/general.values';

const props = defineProps({
  columns: { type: Array as PropType<DataTableColumns<any>>, default: () => [] },
  rowProps: { type: Function as PropType<any>, default: () => {} },
  endpoint: { type: String, required: true },
  tableFilters: { type: Object as PropType<TableFilters>, default: () => null },
  title: { type: String, default: '' },
  tableSorter: { type: Object as PropType<DataTableSortState>, default: () => null },
});

const tableRef = ref<DataTableInst | null>(null);

const search = ref('');
const isSearchAvailable = computed(() => filters.value?.search !== undefined);
const filterValues = computed(
  () =>
    Object.values(filters.value || {})
      .filter(filter => filter.show && filter?.options?.length)
      .map(filter => filter.value) || []
);
const sorter = ref<DataTableSortState | null>(props.tableSorter);
const pagination = ref<PaginationConfig>(createPagination());
const loading = ref(false);
const items = ref([] as any[]);
const filters = ref(props.tableFilters);

onMounted(() => {
  getItems();
});

watch(
  () => filterValues.value,
  _ => {
    getItems();
  }
);
watch(
  () => filters.value?.search?.value || search.value,
  search => {
    if (isSearchAvailable.value && search) {
      debouncedSearchFilter();
    }
  }
);
const debouncedSearchFilter = useDebounceFn(getItems, 500);

/** Sort column - fetch directory content with order params  */
async function handleSorterChange(_sorter?: DataTableSortState) {
  sorter.value = _sorter && _sorter.order !== false ? _sorter : null;

  if (sorter.value) {
    await getItems(1, PAGINATION_LIMIT);
  } else {
    clearSorter();
  }
}
/** Reset sort if user search change directory or search directory content */
function clearSorter() {
  if (tableRef.value) {
    tableRef.value.sort(0, false);
    sorter.value = null;
  }
}

/** On page change, load data */
async function getItems(page: number = 1, limit: number = PAGINATION_LIMIT) {
  if (!loading.value) {
    loading.value = true;
    pagination.value.page = page;
    pagination.value.pageSize = limit;
    const args = { page, limit, sorter: sorter.value ?? undefined };
    syncFilters(filters.value, args);

    try {
      const res = await $api.get<GeneralResponse<any>>(props.endpoint, parseArguments(args));
      loading.value = false;
      items.value = res.data.items;
      pagination.value.itemCount = res.data.total;
    } catch (error) {
      items.value = [];
      loading.value = false;
      pagination.value.itemCount = 0;
      window.$message.error(apiError(error));
    }
    loading.value = false;
  }
}
</script>
