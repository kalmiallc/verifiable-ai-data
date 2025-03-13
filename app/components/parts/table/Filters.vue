<template>
  <template v-for="(filter, key) in filters">
    <SelectOptions
      v-if="filter.show && filter.options"
      v-model:value="filter.value"
      class="min-w-32 w-[12vw] max-w-xs"
      :options="filter.options"
      :placeholder="key"
      :loading="loading && editedFilter === key"
      clearable
      @update:value="value => (editedFilter = key)"
    />
  </template>
</template>

<script lang="ts" setup>
import type { TableFilters } from '~/lib/types/config';

defineProps({
  filters: { type: Object as PropType<TableFilters>, default: {} },
  loading: { type: Boolean, default: false },
});

const editedFilter = ref('');
</script>
