<template>
  <n-modal
    v-bind="$attrs"
    preset="card"
    :class="size === 'large' ? 'max-w-5xl' : 'max-w-2xl'"
    :title="title"
    close-on-esc
  >
    <slot />
  </n-modal>
</template>

<script lang="ts" setup>
defineProps({
  size: { type: String as PropType<'medium' | 'large'>, default: 'medium' },
  title: { type: String, default: null },
});
</script>
