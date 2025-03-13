<template>
  <Swiper v-if="!loading && banners.length" :slides-per-view="isLg ? 3 : 'auto'" :space-between="10" :class="'mb-6'">
    <SwiperSlide v-for="(banner, i) in banners" :key="banner.id" class="min-w-[330px] max-w-[500px]">
      <BannerCard :banner="banner" :index="i" />
    </SwiperSlide>
  </Swiper>
  <div v-if="loading" class="flex gap-2.5 mb-6">
    <n-skeleton height="158px" width="100%" class="rounded-[8px]" />
    <n-skeleton height="158px" width="100%" class="rounded-[8px] md:block hidden" />
    <n-skeleton height="158px" width="100%" class="rounded-[8px] lg:block hidden" />
  </div>
</template>

<script lang="ts" setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import Endpoints from '~/lib/values/endpoints';
import 'swiper/css';

const message = useMessage();
const { isLg } = useScreen();

const banners = ref([] as any[]);
const loading = ref(true);

onMounted(async () => {
  await getBanners();
});

async function getBanners() {
  loading.value = true;
  try {
    const res = await $api.get<any>(Endpoints.banners, {});

    if (res.data) {
      banners.value = res.data;
    }
  } catch (error) {
    message.error(apiError(error));
  } finally {
    loading.value = false;
  }
}
</script>
