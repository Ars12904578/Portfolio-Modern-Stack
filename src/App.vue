<script setup lang="ts">
import LiquidGlass from "./components/LiquidGlass.vue";
import { ref, onMounted, onUnmounted, watch } from "vue";
let loaderExitTimer: ReturnType<typeof setTimeout> | undefined;
import { Search, ChevronLeft, X } from "@lucide/vue";
import { useRouter, useRoute } from "vue-router";
const isLoaded = ref(false);
const isExploreClicked = ref(false);
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
  edgeIntensity: 1,
  rimHighlights: 0.2,
  blur: 0,
});

watch(
  () => route.path,
  (path) => {
    if (path !== "/") {
      isExploreClicked.value = true;
    } else {
      isExploreClicked.value = false; // reset pag bumalik sa home
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
    class="fixed w-250 aspect-square rounded-full -bottom-100 left-5/10 -translate-x-1/2"
    :style="{
      background:
        route.path == '/gallery' || route.path == '/gallery/photo'
          ? 'radial-gradient(circle, rgba(120, 53, 15, 1) 0%, rgba(120, 53, 15, 0.7) 25%, transparent 50%)'
          : 'radial-gradient(circle, rgba(15, 23, 42, 1) 0%, rgba(15, 23, 42, 0.7) 25%, transparent 50%)',
    }"
  ></div>
  <!-- Reactive text of my name -->
  <div class="w-full fixed h-2/10 md:h-5/11 flex items-center justify-center">
    <span class="text-center text-6xl md:text-7xl lg:text-8xl font-semibold">
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
    class="w-fit z-99 fixed left-1/2 -translate-x-1/2 flex flex-row items-center bottom-5"
  >
    <LiquidGlass
      class="w-fit hover:scale-105 active:scale-95 font-light rounded-full text-white hover:bg-white hover:text-black cursor-pointer flex items-center justify-center transition-[background-color,padding,font-size,color] duration-300 ease-out"
      :class="[
        route.path == '/' ? 'p-5 px-15 text-3xl gap-5' : 'p-3 px-8 text-2xl gap-2',

        route.path == '/gallery' || route.path == '/gallery/photo'
          ? isExploreClicked
            ? 'bg-amber-800/50'
            : 'bg-amber-800/20'
          : 'bg-slate-800/50',
      ]"
      :refraction="100"
      :edgeIntensity="1"
      :rimHighlights="0.5"
      :blur="1"
      @click="isExploreClicked = !isExploreClicked"
    >
      <span>{{ isExploreClicked ? "Close" : "Explore" }}</span>
      <span class="relative w-5 h-8 inline-block">
        <Search
          class="absolute inset-1/2 -translate-1/2 transition-all duration-200"
          :class="
            isExploreClicked
              ? 'opacity-0 scale-0 rotate-90'
              : 'opacity-100 scale-100 rotate-0'
          "
          :size="route.path == '/' ? 32 : 22"
        />
        <X
          class="absolute inset-1/2 -translate-1/2 transition-all duration-200"
          :class="
            !isExploreClicked
              ? 'opacity-0 scale-0 rotate-90'
              : 'opacity-100 scale-100 rotate-0'
          "
          :size="route.path == '/' ? 32 : 22"
        />
      </span>
    </LiquidGlass>

    <div
      class="back-button-wrap"
      :class="{
        'back-button-wrap--visible': isExploreClicked && route.path !== '/',
      }"
    >
      <div class="back-button-inner">
        <LiquidGlass
          class="w-15 aspect-square shrink-0 cursor-pointer rounded-full font-light text-white hover:bg-white hover:text-black active:scale-90 transition-transform duration-200"
          :class="
            route.path == '/gallery' || route.path == '/gallery/photo'
              ? 'bg-amber-800/50'
              : 'bg-slate-800/50'
          "
          :refraction="100"
          :edgeIntensity="1"
          :rimHighlights="0.5"
          :blur="1"
          :aria-label="'Go back'"
          @click="router.back()"
        >
          <ChevronLeft />
        </LiquidGlass>
      </div>
    </div>
  </div>
  <!-- Floaters -->
  <div
    v-for="floating in floatings"
    :key="floating.title"
    :class="['w-fit fixed -translate-1/2', floating.location]"
  >
    <LiquidGlass
      class="cursor-grab p-2 px-4 text-white text-shadow-xl font-semibold bg-black/40 text-xl rounded-2xl hover:scale-105 active:scale-95"
      v-bind="floatingGlassSettings"
      draggable
    >
      {{ floating.title }}
    </LiquidGlass>
  </div>
  <!-- Router Page -->
  <div
    class="fixed box-border overflow-hidden backdrop-blur-sm text-white flex rounded-t-4xl transition-transform duration-300 ease-out"
    :class="[
      'content-box-glass top-5 sm:inset-x-5 bottom-0 inset-x-2 md:inset-x-10',
      isExploreClicked
        ? 'translate-y-0'
        : 'translate-y-full pointer-events-none',
      route.path == '/gallery' || route.path == '/gallery/photo'
        ? 'bg-amber-950/70'
        : 'bg-slate-950/70',
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

/* Palitan ang buong .back-button-slot rules */
.back-button-wrap {
  display: grid;
  grid-template-columns: 0fr;
  opacity: 0;
  margin-left: 0;
  transition:
    grid-template-columns 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    margin-left 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.2s ease;
  pointer-events: none;
}
.back-button-wrap--visible {
  grid-template-columns: 1fr;
  margin-left: 0.5rem; /* dito na lang ilalagay yung "gap" — dynamic, di na laging active */
  opacity: 1;
  pointer-events: auto;
}
.back-button-inner {
  overflow: hidden;
  min-width: 0; /* required para gumana yung grid-template-columns 0fr shrink */
  display: flex;
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

.content-box-glass {
  background-image: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.16),
    rgba(255, 255, 255, 0.04) 42%,
    rgba(0, 0, 0, 0.08)
  );
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.38),
    inset 0 -1px 0 rgba(0, 0, 0, 0.16),
    inset 0 0 18px color-mix(in srgb, white 70%, transparent),
    0 7px 24px rgba(0, 0, 0, 0.18);
}
</style>
