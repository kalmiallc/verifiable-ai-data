<template>
  <div
    class="card flex"
    :class="[alignment, size === 'md' ? 'gap-4 !p-4' : size === 'lg' ? 'gap-6 !p-6' : 'gap-8 !p-8']"
  >
    <div v-if="image?.src" class="max-w-[50%]">
      <img v-bind="image" class="mx-auto rounded-xl" :alt="image?.alt || title" />
    </div>
    <div class="flex flex-col justify-between">
      <div v-if="title || content">
        <component v-if="title" :is="size === 'sm' ? 'h3' : size === 'md' ? 'h2' : 'h1'" class="whitespace-pre-line">
          {{ title }}
        </component>
        <p v-if="content" class="mt-2 mb-6 whitespace-pre-line">
          {{ content }}
        </p>
      </div>

      <div>
        <slot />
      </div>
    </div>
    <slot name="additional" />
  </div>
</template>

<script lang="ts" setup>
import type { ImageProps } from 'naive-ui';
import type { Justify } from 'naive-ui/es/space/src/Space';

defineProps({
  image: { type: Object as PropType<ImageProps>, default: '' },
  alignment: { type: String as PropType<Justify>, default: 'justify-between' },
  title: { type: String, default: '' },
  content: { type: String, default: '' },
  size: { type: String as PropType<'sm' | 'md' | 'lg'>, default: 'md' },
});
</script>
