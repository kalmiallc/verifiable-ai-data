<template>
  <n-dropdown v-bind="$attrs" trigger="click">
    <Btn type="secondary">
      <span class="inline-flex gap-2 justify-between items-center">
        <span v-if="text">{{ text }}</span>
        <span v-else>{{ $t('general.select') }}</span>
        <NuxtIcon name="icon/arrow-down" class="icon-auto" />
      </span>
    </Btn>
  </n-dropdown>
</template>

<script lang="ts" setup>
defineProps({
  text: { type: String, default: '' },
});
</script>
