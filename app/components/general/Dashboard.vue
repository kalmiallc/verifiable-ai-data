<template>
  <div>
    <Header ref="headerRef" class="min-h-[86px]" />
    <NavigationNew />
    <!-- <n-menu
      v-model:value="activeKey"
      mode="horizontal"
      :options="menuOptions"
      @update:value="handleMenuUpdate"
      class="tab-style"
    /> -->

    <div v-if="loading">
      <transition name="fade" appear>
        <div v-if="loadingAnimation" class="w-full flex flex-col gap-2 h-screen items-center">
          <div class="w-full flex flex-col gap-2 pt-4 max-w-[1241px] px-8" :style="heightScreen">
            <!-- Loading skeleton - on long page load show skeleton -->
            <n-skeleton height="80px" width="100%" class="rounded-[8px] min-h-[80px]" />
            <div class="flex md:gap-8 lg:gap-24 h-full mt-10">
              <div style="" class="w-full min-w-[250px] max-w-[736px]">
                <n-skeleton height="100vh" width="100%" class="rounded-[8px]" />
              </div>
              <div style="" class="hidden md:block min-w-[260px] max-w-[409px] flex-grow">
                <n-skeleton height="400px" width="100%" class="rounded-[8px]" />
                <n-skeleton height="230px" width="100%" class="rounded-[8px] mt-6" />
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <div v-else>
      <div class="flex flex-auto w-full flex-col md:flex-row bg-grey-dark">
        <n-layout class="">
          <n-layout-content>
            <n-infinite-scroll y-scrollable :style="scrollScreen" :distance="10" @load="onLoadMore">
              <div class="flex flex-col gap-4 justify-between pt-4" :style="fullHeight ? heightScreen : {}">
                <div class="flex flex-col items-center w-full">
                  <div class="xl:max-w-[1520px] w-full px-4">
                    <slot />
                  </div>
                </div>
                <div>
                  <slot name="bottom" />
                </div>
              </div>
            </n-infinite-scroll>
          </n-layout-content>
        </n-layout>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useTemplateRef } from 'vue';

const props = defineProps({
  fullHeight: { type: Boolean, default: true },
  loading: { type: Boolean, default: false },
});

/** Heading height */
const headerRef = useTemplateRef('headerRef');

const emit = defineEmits(['loadMore']);

const onLoadMore = () => {
  emit('loadMore');
};

const calcHeaderHeight = () => (headerRef.value?.$el?.clientHeight || 86) + 60;
const headerHeight = ref<number>(calcHeaderHeight());

const scrollScreen = computed(() => ({
  maxHeight: `calc(100dvh - ${headerHeight.value}px)`,
}));
const heightScreen = computed(() => ({
  minHeight: `calc(100dvh - ${headerHeight.value}px)`,
}));

const { width } = useWindowSize();
watch(
  () => width.value,
  () => (headerHeight.value = calcHeaderHeight())
);

/** Delay animation */
const loadingAnimation = ref<boolean>(false);
onMounted(() => {
  setLoadingAnimation(props.loading);
});

watch(
  () => props.loading,
  isLoading => {
    setLoadingAnimation(isLoading);
  }
);
function setLoadingAnimation(isLoading: boolean) {
  const delay = isLoading ? 10 : 0;
  setTimeout(() => {
    loadingAnimation.value = isLoading;
    headerHeight.value = calcHeaderHeight();
  }, delay);
}
</script>
