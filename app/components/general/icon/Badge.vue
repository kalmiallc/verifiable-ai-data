<template>
  <div class="absolute w-[34px] h-[34px] rounded-full flex-cc" :class="{ 'border border-black': border }">
    <slot />
  </div>
</template>

<script lang="ts" setup>
defineProps({
  border: { type: Boolean, default: false },
});
</script>
