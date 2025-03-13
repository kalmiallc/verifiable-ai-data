<template>
  <div class="relative flex flex-col justify-center align-middle min-h-screen h-full">
    <div class="container relative max-w-lg py-16 sm:px-8 md:px-12 lg:px-16 card">
      <div>
        <!-- customize 404 message from template section -->
        <h4>{{ $t('error.404') }}</h4>

        <!-- Redirect to home page -->
        <button @click="handleError">
          {{ $t('general.goHome') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// const userStore = useUserStore();
// const { isLg } = useScreen();
// const messageRef = ref<HTMLDivElement>();
// const mainContentRef = ref<HTMLDivElement>();
// const showMobileSidebar = ref<boolean>(false);

/**
 * Show/hide sidebar on mobile

const { lengthX, lengthY } = useSwipe(mainContentRef, {
  onSwipeEnd() {
    if (
      !isLg.value &&
      Math.abs(lengthX.value) > 150 &&
      Math.abs(lengthX.value) > Math.abs(lengthY.value)
    ) {
      toggleSidebar(lengthX.value < 0);
    }
  },
}); */

/** Hide sidebar if user flip device in mobile view 
watch(
  () => isLg.value,
  isLg => {
    toggleSidebar(isLg);
  }
); */

// function toggleSidebar(show?: boolean) {
//   if (show === undefined) {
//     showMobileSidebar.value = !showMobileSidebar.value;
//   } else {
//     showMobileSidebar.value = show;
//   }
// }

// clear error and redirect to home page
const handleError = () => clearError({ redirect: '/' });
</script>
