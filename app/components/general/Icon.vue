<script lang="ts" setup>
const props = defineProps({
  color: { type: String, default: '' },
  name: { type: String, required: true },
  filled: { type: Boolean, default: false },
  size: {
    type: String as PropType<
      '2xs' | 'xs' | 'sm' | 'md' | 'lg' | '12' | '16' | '20' | '24' | '32' | '35' | '38' | '40' | '48'
    >,
    default: 'md',
  },
});

const fontSize = computed(() => {
  switch (props.size) {
    case '2xs':
    case '12':
      return '12px';
    case 'xs':
    case '16':
      return '16px';
    case 'sm':
    case '20':
      return '20px';
    case 'lg':
    case '32':
      return '32px';
    case '35':
      return '35px';
    case '38':
      return '38px';
    case '40':
      return '40px';
    case '48':
      return '40px';
    default:
      return '24px';
  }
});
</script>

<template>
  <NuxtIcon :name="name" :filled="filled" :style="{ color, fontSize }" />
</template>

<style lang="postcss">
.nuxt-icon svg {
  margin-bottom: 0;
}
</style>
