<template>
  <n-infinite-scroll
    y-scrollable
    :style="scrollScreen"
    class="overflow-y-auto h-full w-full"
    :distance="10"
    @load="onLoadMore"
  >
    <slot />
  </n-infinite-scroll>
</template>

<script lang="ts" setup>
import { useInfiniteScroll } from '@vueuse/core';

defineProps({
  scrollScreen: { type: String, default: '' },
});

const scrollRef = ref(null);

const emit = defineEmits(['loadMore']);

const onLoadMore = () => {
  emit('loadMore');
};

useInfiniteScroll(scrollRef, onLoadMore, {
  distance: 10,
});
</script>
