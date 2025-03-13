<template>
  <div class="rounded-xl bg-gradientBorder p-[1px]">
    <div class="card">
      <component v-if="title" :is="size === 'sm' ? 'h4' : size === 'md' ? 'h3' : 'h2'" class="whitespace-pre-line">
        {{ title }}
      </component>
      <p v-if="content" class="mt-2 mb-6 whitespace-pre-line">
        {{ content }}
      </p>

      <div v-if="image?.src || icon" class="flex items-end gap-6">
        <div class="flex-cc min-h-16">
          <img v-if="image && image.src" v-bind="image" class="mx-auto rounded-xl" :alt="image?.alt || title" />
          <NuxtIcon v-else-if="icon" :name="icon" filled />
        </div>
        <div>
          <slot />
        </div>
      </div>
      <slot v-else />
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
  size: { type: String as PropType<'sm' | 'md' | 'lg' | 'xl'>, default: 'lg' },
});
</script>
