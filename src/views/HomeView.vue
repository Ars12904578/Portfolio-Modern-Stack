<script setup lang="ts">
import LiquidGlass from "../components/LiquidGlass.vue";
import { useRouter } from "vue-router";
// import { ref } from "vue";
const router = useRouter()
</script>

<template>
  <img
    src="/bg.jpg"
    alt="bg"
    class="object-cover fixed w-full h-dvh object-center"
  />
  <div class="relative w-full h-dvh overflow-hidden">
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
    <div class="w-fit fixed bottom-5 sm:bottom-10 left-1/2 right-1/2 -translate-x-1/2">
      <LiquidGlass
        class="p-5 px-20 text-white bg-black/50 text-3xl font-light rounded-full hover:scale-120 active:scale-90 active:bg-white active:text-black"
        :refraction="40"
        :dispersion="8"
        :edge-intensity="1.2"
        :rim-highlights="0.45"
        :blur="0"
        @click="router.push('/about')"
      >
        Explore
      </LiquidGlass>
    </div>
    <div class="w-fit fixed top-5/20 left-14/20 sm:top-5/20 sm:left-11/20 -translate-1/2">
      <LiquidGlass
        class="p-2 px-4 text-white text-shadow-xl font-semibold bg-black/60 text-xl rounded-2xl hover:scale-105 active:scale-95"
        :refraction="50"
        :dispersion="10"
        :edge-intensity="1"
        :rim-highlights="0.35"
        :blur="0"
        draggable
      >
        Programmer
      </LiquidGlass>
    </div>
    <div class="w-fit fixed top-11/20 left-3/20 sm:top-11/20 sm:left-8/20 -translate-1/2">
      <LiquidGlass
        class="p-2 px-4 text-white text-shadow-xl font-semibold bg-black/60 text-xl rounded-2xl hover:scale-105 active:scale-95"
        :refraction="50"
        :dispersion="10"
        :edge-intensity="1"
        :rim-highlights="0.35"
        :blur="0"
        draggable
      >
        Editor
      </LiquidGlass>
    </div>
    <div class="w-fit fixed top-14/20 left-16/20 sm:left-13/20 -translate-1/2">
      <LiquidGlass
        class="p-2 px-4 text-white text-shadow-xl font-semibold bg-black/60 text-xl rounded-2xl hover:scale-105 active:scale-95"
        :refraction="50"
        :dispersion="10"
        :edge-intensity="1"
        :rim-highlights="0.35"
        :blur="0"
        draggable
      >
        Technical Director
      </LiquidGlass>
    </div>
  </div>
</template>

<style scoped></style>
