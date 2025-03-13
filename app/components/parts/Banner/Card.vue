<template>
  <n-card class="max-w-[500px] !border-none" :content-class="'!px-3 !py-4 !rounded-[8px] ' + getBg()">
    <div class="flex gap-3 relative">
      <div class="w-[106px] h-[126px] flex-shrink-0 rounded-[8px] border border-white bg-white/10">
        <img class="w-full h-full object-cover" :src="banner.imageUrl" />
      </div>

      <div class="flex flex-col">
        <div class="flex-grow">
          <div class="font-bold text-[16px]">
            {{ banner.title }}
          </div>
          <div class="text-[12px]">
            {{ banner.description }}
          </div>
        </div>
        <BasicButton
          :to="{
            name: 'markets-id',
            params: { id: banner.prediction_set_id },
          }"
          btn-class="!bg-white/25 w-fit  hover:!bg-white/30"
        >
          {{ banner.button }}
        </BasicButton>
      </div>
      <div class="absolute -right-2 md:right-0 bottom-0">
        <NuxtIcon name="icon/star-group" class="text-[38px] md:text-[44px]" />
      </div>
    </div>
  </n-card>
</template>

<script lang="ts" setup>
import BasicButton from '~/components/general/BasicButton.vue';

const props = defineProps({
  banner: { type: Object, default: null, required: true },
  index: { type: Number, default: 0 },
});

const getBg = () => {
  switch (props.index % 3) {
    case 0:
      return 'bg-gradientBannerGreen';
    case 1:
      return 'bg-gradientBannerRed';
    default:
      return 'bg-gradientBannerBlue';
  }
};
</script>
