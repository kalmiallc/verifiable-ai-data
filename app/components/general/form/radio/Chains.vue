<template>
  <n-radio-group name="radiogroup-chains" size="large" :theme-overrides="radioGroupOverride">
    <n-radio-button v-for="chain in chainOptions" :key="chain.value" :value="chain.value" :label="chain.label">
      <NuxtIcon :name="`logo/${chain.label}`" class="text-4xl" filled />
    </n-radio-button>
  </n-radio-group>
</template>

<script lang="ts" setup>
import { useChains } from '@wagmi/vue';
import type { GlobalThemeOverrides } from 'naive-ui';
import { colors } from '~/tailwind.config';

const chains = useChains();
const chainOptions = computed(() => chains.value.map(i => ({ label: i.name, value: i.id })));

const radioGroupOverride: GlobalThemeOverrides['Radio'] = {
  buttonHeightSmall: '34px',
  buttonHeightMedium: '40px',
  buttonHeightLarge: '48px',
  buttonBorderRadius: '9999px',
  buttonBoxShadow: 'none',
  buttonBoxShadowFocus: 'none',
  buttonBoxShadowHover: 'none',
  buttonColor: colors.transparent,
  buttonColorActive: colors.blue.DEFAULT,
  buttonBorderColor: colors.transparent,
  buttonBorderColorActive: colors.blue.DEFAULT,
  buttonBorderColorHover: colors.transparent,
};
</script>

<style lang="postcss" scoped>
.n-radio-group {
  @apply inline-flex gap-2;

  :deep(.n-radio-button) {
    @apply p-0 rounded-full h-auto border-[5px] border-transparent;

    .n-radio__label {
      @apply border border-transparent rounded-full;
    }
    &:not(.n-radio-button--checked) .n-radio__label {
      @apply border-black;
    }
  }

  :deep(.n-radio-group__splitor.n-radio-group__splitor--checked) {
    @apply bg-transparent;
  }
}
</style>
