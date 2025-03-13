<template>
  <div class="loader text-center text-white bg-gray-700">
    <Logo class="h-16 py-4" />
    <div>, loading ...</div>
  </div>
</template>

<style lang="postcss" scoped>
.loader {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
