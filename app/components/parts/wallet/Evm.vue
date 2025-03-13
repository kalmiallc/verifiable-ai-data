<script lang="ts" setup>
import { useConnect } from '@wagmi/vue';

defineProps({
  loading: { type: Boolean, default: false },
});

const { connect, connectors } = useConnect();
</script>

<template>
  <n-space :size="22" vertical>
    <BasicButton
      v-for="(connector, key) in connectors"
      :key="key"
      class="flex-cc w-full"
      :class="{
        'relative card flex items-center py-3 pl-2 pr-4 pointer-events-none': !connector,
      }"
      type="secondary"
      size="large"
      @click="connect({ connector })"
    >
      <span class="flex flex-1 justify-start gap-2 items-center">
        <NuxtIcon :name="`wallet/${connector.type}`" filled />
        {{ connector.name }}
      </span>
    </BasicButton>
  </n-space>
</template>
