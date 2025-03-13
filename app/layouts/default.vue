<template>
  <div v-if="!userStore.loadingProfile" ref="mainContentRef" class="relative">
    <n-layout class="h-screen">
      <n-layout :native-scrollbar="false">
        <div>
          <NuxtPage />
        </div>
      </n-layout>
    </n-layout>
  </div>
</template>

<script lang="ts" setup>
/** Global messages */
const message = useMessage();
window.$message = message;

const userStore = useUserStore();
const { isLg } = useScreen();
const mainContentRef = ref<HTMLDivElement>();
const showMobileSidebar = ref<boolean>(false);

/**
 * Show/hide sidebar on mobile
 */
const { lengthX, lengthY } = useSwipe(mainContentRef, {
  onSwipeEnd() {
    if (!isLg.value && Math.abs(lengthX.value) > 250 && Math.abs(lengthX.value) > Math.abs(lengthY.value)) {
      const isLeftToRight = lengthX.value < 0;
      toggleSidebar(isLeftToRight);
    }
  },
});

/** Hide sidebar if user flip device in mobile view */
watch(
  () => isLg.value,
  isLg => {
    toggleSidebar(isLg);
  }
);

function toggle(item: Ref<boolean>, show?: boolean) {
  if (show === undefined) {
    item.value = !item.value;
  } else {
    item.value = show;
  }
}

function toggleSidebar(show?: boolean) {
  toggle(showMobileSidebar, show);
}
</script>
