<template>
  <n-radio-group v-bind="$attrs">
    <n-radio-button v-for="chain in options" :key="chain.value" :value="chain.value" :label="chain.label" />
  </n-radio-group>
</template>

<script lang="ts" setup>
import type { Option } from 'naive-ui/es/legacy-transfer/src/interface';

defineProps({
  options: { type: Array<Option>, default: [] },
});
</script>

<style lang="postcss" scoped>
.n-radio-group {
  @apply inline-flex gap-2;

  :deep(.n-radio-button) {
    @apply min-w-[72px] text-center;
    border-radius: var(--n-button-border-radius);

    .n-radio-button__state-border {
      border-radius: var(--n-button-border-radius);
    }
  }

  :deep(.n-radio-group__splitor) {
    @apply bg-transparent;
  }
}
</style>
