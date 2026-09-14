<script setup lang="ts">
import LiquidGlass from "./components/LiquidGlass.vue";
import { useRouter, RouterView } from "vue-router";
import { ref } from "vue";
// const router = useRouter();

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
  rimHighlights: 1,
  blur: 0,
});

const isExploreClicked = ref(false);
</script>

<template>
  <img
    src="/bg.jpg"
    alt="bg"
    class="object-cover fixed w-full h-dvh object-center"
  />
  <div class="w-full fixed h-2/10 md:h-5/11 flex items-center justify-center">
    <span
      class="text-center text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold"
    >
      Arvi Jay <br />
      Tungpalan
    </span>
  </div>
  <img
    src="/assets/Tungpalan__Arvi_Jay_B-removebg-preview.png"
    alt="Arvi"
    class="object-contain object-bottom w-fit h-8/10 drop-shadow-[0_10px_20px_rgba(0,0,0,1)] fixed bottom-0 left-1/2 right-1/2 -translate-x-1/2"
  />
  <div
    class="w-fit z-99 fixed bottom-5 sm:bottom-10 left-1/2 right-1/2 -translate-x-1/2"
  >
    <LiquidGlass
      class="font-light rounded-full active:bg-white active:text-black cursor-pointer"
      :class="
        isExploreClicked
          ? 'text-black bg-white hover:scale-105 active:scale-95 p-2 px-10 text-xl'
          : 'text-white bg-black/50 hover:scale-120 active:scale-80 p-5 px-20 text-3xl'
      "
      :refraction="100"
      :edgeIntensity="1"
      :rimHighlights="0.5"
      :blur="4"
      @click="isExploreClicked = !isExploreClicked"
    >
      {{ isExploreClicked ? "Close" : "Explore" }}
    </LiquidGlass>
  </div>

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
  <div
    class="fixed p-2 inset-x-0 box-border bg-black/50 text-white"
    :class="
      isExploreClicked
        ? 'bottom-0 top-0 scale-100'
        : '-bottom-1/2 top-full scale-0'
    "
  >
    <RouterView class="w-full h-full" />
  </div>
</template>

<style scoped></style>
