<script setup lang="ts">
import LiquidGlass from "./components/LiquidGlass.vue";
import { ref, onMounted, onUnmounted, watch } from "vue";
let loaderExitTimer: ReturnType<typeof setTimeout> | undefined;
import { Search, ChevronLeft } from "@lucide/vue";
import { useRouter, useRoute } from "vue-router";
const isLoaded = ref(false);
const isLoaderVisible = ref(true);
const router = useRouter();
const route = useRoute();
const floatings = ref([
  {
    title: "Programmer",
    location: "top-5/20 left-14/20 sm:top-5/20 sm:left-11/20",
  },
  {
    title: "Editor",
    location: "top-11/20 left-3/20 sm:top-11/20 sm:left-8/20",
  },
  {
    title: "Technical Director",
    location: "top-14/20 left-16/20 sm:left-13/20",
  },
]);

const floatingGlassSettings = ref({
  refraction: 100,
  edgeIntensity: 0.5,
  rimHighlights: 0.5,
  blur: 0,
});

const isExploreClicked = ref(false);

watch(
  () => route.path,
  (path) => {
    if (path !== "/") {
      isExploreClicked.value = true;
    }
  },
);

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true;
    loaderExitTimer = setTimeout(() => {
      isLoaderVisible.value = false;
    }, 450);
  }, 1500);
});

onUnmounted(() => {
  if (loaderExitTimer) clearTimeout(loaderExitTimer);
});
</script>

<template>
  <!-- White background picture -->
  <img
    src="/bg.jpg"
    alt="bg"
    class="object-cover fixed w-full h-dvh object-center"
  />
  <!-- Design -->
  <div
    class="fixed w-190 aspect-square rounded-full bg-slate-900 -bottom-100 left-5/10 -translate-x-1/2"
  ></div>
  <!-- Reactive text of my name -->
  <div class="w-full fixed h-2/10 md:h-5/11 flex items-center justify-center">
    <span
      class="text-center text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold"
    >
      Arvi Jay <br />
      Tungpalan
    </span>
  </div>
  <!-- My picture -->
  <img
    src="/assets/Tungpalan__Arvi_Jay_B-removebg-preview.png"
    alt="Arvi"
    class="object-contain object-bottom w-fit h-8/10 drop-shadow-[0_10px_20px_rgba(0,0,0,1)] fixed bottom-0 left-1/2 -translate-x-1/2"
    :class="isExploreClicked ? 'scale-50' : 'scale-100'"
  />
  <!-- CTA button -->
  <div
    class="w-fit z-99 fixed left-1/2 -translate-x-1/2 flex flex-row gap-2"
    :class="isExploreClicked ? 'bottom-2 sm:bottom-2' : 'bottom-5 sm:bottom-10'"
  >
    <LiquidGlass
      class="font-light rounded-full text-white hover:bg-white hover:text-black cursor-pointer flex items-center justify-center gap-2"
      :class="
        isExploreClicked
          ? 'hover:scale-105 active:scale-95 p-2 px-10 text-xl bg-white/10'
          : 'hover:scale-120 active:scale-80 p-5 px-20 text-3xl bg-black/40'
      "
      :refraction="100"
      :edgeIntensity="1"
      :rimHighlights="0.5"
      :blur="4"
      @click="isExploreClicked = !isExploreClicked"
    >
      {{ isExploreClicked ? "Close" : "Explore" }}
      <component :is="isExploreClicked ? null : Search" />
    </LiquidGlass>
    <div
      class="back-button-slot"
      :class="{
        'back-button-slot--visible': isExploreClicked && route.path !== '/',
      }"
    >
      <LiquidGlass
        class="h-12 w-12 shrink-0 cursor-pointer rounded-full bg-white/10 font-light text-white hover:bg-white hover:text-black active:scale-90"
        :refraction="100"
        :edgeIntensity="1"
        :rimHighlights="0.5"
        :blur="4"
        :aria-label="'Go back'"
        @click="router.back()"
      >
        <ChevronLeft />
      </LiquidGlass>
    </div>
  </div>
  <!-- Floaters -->
  <div
    v-for="floating in floatings"
    :key="floating.title"
    :class="['w-fit fixed -translate-1/2', floating.location]"
  >
    <LiquidGlass
      class="p-2 px-4 text-white text-shadow-xl font-semibold bg-black/60 text-xl rounded-2xl hover:scale-105 active:scale-95"
      v-bind="floatingGlassSettings"
      draggable
    >
      {{ floating.title }}
    </LiquidGlass>
  </div>
  <!-- Router Page -->
  <div
    class="fixed box-border overflow-hidden bg-slate-950/30 backdrop-blur-3xl text-white flex rounded-t-4xl transition-transform duration-300 ease-out"
    :class="[
      'top-5 md:top-20 bottom-0 inset-x-0 md:inset-x-20',
      isExploreClicked
        ? 'translate-y-0'
        : 'translate-y-full pointer-events-none',
    ]"
  >
    <RouterView v-slot="{ Component, route: viewRoute }">
      <Transition name="route" mode="out-in">
        <component :is="Component" :key="viewRoute.fullPath" />
      </Transition>
    </RouterView>
  </div>
  <!-- Loader -->
  <div
    v-if="isLoaderVisible"
    class="loading-overlay fixed z-999 inset-0 bg-black flex flex-col items-center justify-center"
    :class="{ 'loading-overlay--exiting': isLoaded }"
  >
    <img
      src="/assets/android-chrome-192x192.png"
      alt="icon"
      class="loading-animation"
    />
  </div>
</template>

<style scoped>
.loading-animation {
  animation: loading 1s ease infinite;
}
.back-button-slot {
  display: flex;
  max-width: 0;
  overflow: hidden;
  opacity: 0;
  transform: translateX(-8px) scale(0.9);
  transition:
    max-width 0.25s ease,
    opacity 0.2s ease,
    transform 0.25s ease;
  pointer-events: none;
}
.back-button-slot--visible {
  max-width: 3rem;
  opacity: 1;
  transform: translateX(0) scale(1);
  pointer-events: auto;
}
.route-enter-active,
.route-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}
.route-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.route-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
.loading-overlay {
  opacity: 1;
  transition: opacity 0.45s ease;
}
.loading-overlay--exiting {
  opacity: 0;
  pointer-events: none;
}
@keyframes loading {
  0% {
    scale: 0.8;
  }
  50% {
    scale: 1;
  }
  100% {
    scale: 0.8;
  }
}
</style>
