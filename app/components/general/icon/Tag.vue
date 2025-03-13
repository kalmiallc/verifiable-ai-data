<template>
  <div class="h-6 px-2 py-1 rounded-lg flex-cc gap-1 bg-grey">
    <div
      class="h-4 w-1 rounded-lg"
      :class="color === 'green' ? 'bg-green' : color === 'blue' ? 'bg-blue' : color === 'red' ? 'bg-red' : 'bg-purple'"
    ></div>
    <span class="inline-block text-xs text-black font-medium">
      <slot />
    </span>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  color: { type: String, default: 'purple' },
});
</script>
