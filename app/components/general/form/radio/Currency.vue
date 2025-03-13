<template>
  <FormRadio name="radiogroup-currency" :options="currencyOptions" />
</template>

<script lang="ts" setup>
import { useChains } from '@wagmi/vue';

const chains = useChains();
console.log(chains.value);

const currencyOptions = computed(() =>
  chains.value.map(i => ({ label: i.nativeCurrency.name, value: i.nativeCurrency.symbol }))
);
</script>
