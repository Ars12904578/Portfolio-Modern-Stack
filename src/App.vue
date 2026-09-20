<script setup lang="ts">
import LiquidGlass from "./components/LiquidGlass.vue";
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { Search, ChevronLeft, ChevronDown } from "@lucide/vue";
import { useRouter, useRoute } from "vue-router";
import { isRouteLoading } from "./router";
const isLoaded = ref(false);
const isExploreClicked = ref(false);
const isLoaderVisible = ref(true);
const bgVideoOne = ref<HTMLVideoElement | null>(null);
const bgVideoTwo = ref<HTMLVideoElement | null>(null);
const router = useRouter();
const route = useRoute();

const resetBackgroundVideos = () => {
  [bgVideoOne.value, bgVideoTwo.value].forEach((video) => {
    if (!video) return;

    video.pause();
    video.currentTime = 0;
    void video.play().catch(() => {});
  });
};

const toggleExplore = () => {
  const nextValue = !isExploreClicked.value;
  isExploreClicked.value = nextValue;

  if (!nextValue) {
    resetBackgroundVideos();
  }
};

const floatings = [
  {
    title: "Programmer",
    location: "top-4/20 left-15/20 sm:top-5/22 sm:left-13/20",
  },
  {
    title: "Full Stack",
    location:
      "top-10/20 left-4/20 sm:top-9/20 sm:left-6/20 md:left-8/23 md:top-7/23",
  },
  {
    title: "Tinkering",
    location: "top-16/20 left-5/20 sm:top-15/20 sm:left-7/20",
  },
  {
    title: "Technical Director",
    location: "top-13/20 left-15/20 sm:top-12/20 sm:left-13/20",
  },
];

const floatingGlassSettings = {
  refraction: 100,
  edgeIntensity: 0.8,
  blur: 1,
};

watch(
  () => route.path,
  (path) => {
    if (path !== "/") {
      isExploreClicked.value = true;
    }
  },
);

let loaderExitTimer: ReturnType<typeof setTimeout> | undefined;
let loaderTimer: ReturnType<typeof setTimeout> | undefined;

onMounted(() => {
  loaderTimer = setTimeout(() => {
    isLoaded.value = true;

    loaderExitTimer = setTimeout(() => {
      isLoaderVisible.value = false;
    }, 450);
  }, 1500);
});

onUnmounted(() => {
  if (loaderTimer) clearTimeout(loaderTimer);
  if (loaderExitTimer) clearTimeout(loaderExitTimer);
});

const isGallery = computed(() =>
  ["/gallery", "/gallery/photo"].includes(route.path),
);
</script>

<template>
  <!-- Background video -->
  <div
    class="fixed inset-0"
    :class="isGallery ? 'bg-[#684419]' : 'bg-[#183f60]'"
  ></div>
  <video
    ref="bgVideoOne"
    autoplay
    muted
    loop
    playsinline
    class="object-cover fixed w-full h-dvh object-center"
    aria-hidden="true"
  >
    <source src="/assets/bg.mp4" type="video/mp4" />
  </video>
  <video
    ref="bgVideoTwo"
    autoplay
    muted
    loop
    playsinline
    class="object-cover fixed w-full h-dvh object-center"
    :class="isGallery ? 'opacity-100' : 'opacity-0'"
    aria-hidden="true"
  >
    <source src="/assets/bg2.mp4" type="video/mp4" />
  </video>
  <!-- Reactive text of my name -->
  <div class="w-full fixed h-2/8 md:h-4/10 flex items-center justify-center">
    <span
      class="text-center text-white text-6xl md:text-8xl font-semibold text-shadow-lg"
    >
      Arvi Jay <br />
      Tungpalan
    </span>
  </div>
  <!-- My picture -->
  <img
    src="/assets/Tungpalan__Arvi_Jay_B-removebg-preview.png"
    alt="Arvi"
    class="object-contain object-bottom w-fit h-8/10 fixed bottom-0 left-1/2 -translate-x-1/2 drop-shadow-[0_0_50px_white]"
  />
  <!-- CTA button -->
  <div
    class="w-fit z-99 fixed left-1/2 -translate-x-1/2 flex flex-row items-center bottom-5"
  >
    <div
      class="back-button-wrap flex items-center hover:scale-105 active:scale-95"
      :class="{
        'back-button-wrap--visible': isExploreClicked && route.path !== '/',
      }"
    >
      <LiquidGlass
        class="hover:scale-110 active:scale-95 w-15 aspect-square shrink-0 cursor-pointer rounded-full font-light text-white hover:bg-white hover:text-black duration-200"
        :class="isGallery ? 'bg-yellow-800/50' : 'bg-slate-800/50'"
        :refraction="100"
        :edgeIntensity="1"
        :blur="5"
        :aria-label="'Go back'"
        @click="router.back()"
      >
        <ChevronLeft />
      </LiquidGlass>
    </div>
    <LiquidGlass
      class="w-fit hover:scale-110 active:scale-95 font-light rounded-full text-white hover:bg-white hover:text-black cursor-pointer flex items-center justify-center duration-300 ease-out"
      :class="[
        route.path == '/'
          ? 'p-5 px-15 text-3xl gap-5'
          : isExploreClicked
            ? 'p-3 px-8 text-2xl gap-2'
            : 'p-5 px-15 text-3xl gap-5',

        isGallery
          ? isExploreClicked
            ? 'bg-yellow-800/50'
            : 'bg-yellow-800/50'
          : 'bg-slate-800/50',
      ]"
      :refraction="100"
      :edgeIntensity="1"
      :blur="5"
      @click="toggleExplore"
    >
      <span>{{ isExploreClicked ? "Close" : "Explore" }}</span>
      <span class="relative w-5 h-8 inline-block">
        <Search
          class="absolute inset-1/2 -translate-1/2 duration-200"
          :class="
            isExploreClicked
              ? 'opacity-0 scale-0 rotate-90'
              : 'opacity-100 scale-100 rotate-0'
          "
          :size="route.path == '/' ? 32 : isExploreClicked ? 22 : 32"
        />
        <ChevronDown
          class="absolute inset-1/2 -translate-1/2 duration-200"
          :class="
            !isExploreClicked
              ? 'opacity-0 scale-0 rotate-90'
              : 'opacity-100 scale-100 rotate-0'
          "
          :size="route.path == '/' ? 32 : isExploreClicked ? 22 : 32"
        />
      </span>
    </LiquidGlass>
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
    class="fixed box-border overflow-hidden backdrop-blur-sm text-white flex rounded-t-4xl duration-300 ease-out"
    :class="[
      'top-5 sm:inset-x-5 bottom-0 inset-x-0 md:inset-x-10',
      isExploreClicked
        ? 'translate-y-0'
        : 'translate-y-full pointer-events-none',
      isGallery ? 'bg-yellow-950/70' : 'bg-cyan-950/70',
    ]"
  >
    <RouterView v-slot="{ Component, route: viewRoute }">
      <Transition name="route" mode="out-in">
        <component :is="Component" :key="viewRoute.fullPath" />
      </Transition>
    </RouterView>
    <div
      v-if="isRouteLoading"
      class="route-loading absolute inset-0 z-10 flex items-center justify-center bg-black/15 backdrop-blur-[2px]"
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <div class="route-loading__spinner" aria-hidden="true"></div>
    </div>
  </div>
  <!-- Loader -->
  <div
    v-if="isLoaderVisible"
    class="loading-overlay bg-black fixed z-999 inset-0 flex flex-col items-center justify-center"
    :class="[{ 'loading-overlay--exiting': isLoaded }]"
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

.route-loading__spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid rgba(255, 255, 255, 0.35);
  border-top-color: white;
  border-radius: 999px;
  animation: route-loading-spin 0.75s linear infinite;
}

.back-button-wrap {
  width: 0;
  opacity: 0;
  transform: scale(0.8);
  margin-right: 0;
  overflow: visible; /* hindi na kailangan i-clip, self-hiding na sa scale+width 0 */
  transition:
    width 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    margin-right 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.2s ease,
    transform 0.25s ease;
  pointer-events: none;
}
.back-button-wrap--visible {
  width: 3.75rem; /* match sa w-15 */
  margin-right: 0.7rem;
  opacity: 1;
  transform: scale(1);
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

@keyframes route-loading-spin {
  to {
    transform: rotate(360deg);
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
