<template>
  <div class="card-light flex flex-col justify-between p-6 md:p-8 lg:p-12">
    <div>
      <component v-if="title" :is="size === 'sm' ? 'h4' : size === 'md' ? 'h3' : 'h2'" class="mb-4 whitespace-pre-line">
        {{ title }}
      </component>

      <p v-if="content" class="whitespace-pre-line">
        {{ content }}
      </p>
    </div>
    <div class="w-full">
      <slot />
    </div>
    <div class="w-full">
      <slot name="btn" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ImageProps } from 'naive-ui';

defineProps({
  image: { type: Object as PropType<ImageProps>, default: {} },
  icon: { type: String, default: '' },
  title: { type: String, default: '' },
  content: { type: String, default: '' },
  size: { type: String as PropType<'sm' | 'md' | 'lg'>, default: 'md' },
});
</script>
