<script setup lang="ts">
import LiquidGlass from "../components/LiquidGlass.vue";
import { ChevronRight, Code, Camera } from "@lucide/vue";
import { useRouter } from "vue-router";
const router = useRouter();
</script>

<template>
  <div class="flex flex-col items-center justify-center w-full h-full">
    <div
      class="relative grid h-full w-full min-h-0 grid-cols-1 items-center gap-6 overflow-y-auto p-6 lg:grid-cols-2 md:gap-10 md:p-10 box-border"
    >
      <div class="flex min-w-0 items-center justify-center">
        <div
          class="shadow-2xl aspect-square w-full max-w-96 md:max-w-9/10 rounded-4xl bg-white/30 relative"
        >
          <img
            src="/assets/code.png"
            alt="picture"
            class="object-cover w-full h-full rounded-4xl"
          />
          <div
            class="absolute inset-0 linearGradientBlue rounded-4xl flex flex-col items-start justify-end pb-20 p-5"
          >
            <div class="font-bold text-4xl">Programming</div>
            <div class="text-xl text-white/70">HTML, CSS, JS, NodeJS.</div>
          </div>
          <LiquidGlass
            class="absolute bottom-0 inset-x-0 rounded-4xl py-5 text-2xl bg-slate-900/50 text-white hover:scale-110 active:scale-90"
            :blur="4"
            :refraction="100"
            :edge-intensity="0.5"
            :rim-highlights="0.2"
            @click="router.push('/project')"
          >
            My Projects&nbsp;<ChevronRight />
          </LiquidGlass>
          <LiquidGlass
            class="absolute top-5 right-5 rounded-full w-15 h-15 text-2xl bg-slate-900/30 text-white"
            :blur="1"
            :refraction="50"
            :edge-intensity="2"
            :rim-highlights="0.5"
          >
            <Code />
          </LiquidGlass>
        </div>
      </div>
      <div class="flex min-w-0 items-center justify-center">
        <div
          class="shadow-2xl aspect-square w-full max-w-96 md:max-w-9/10 rounded-4xl bg-white/30 relative"
        >
          <img
            src="/assets/photo.jpg"
            alt="picture"
            class="object-cover w-full h-full rounded-4xl"
          />
          <div
            class="absolute inset-0 linearGradientOrange rounded-4xl flex flex-col items-start justify-end pb-20 p-5"
          >
            <div class="font-bold text-4xl">Photography</div>
            <div class="text-xl text-white/70">Portrait & Macro.</div>
          </div>
          <LiquidGlass
            class="absolute bottom-0 inset-x-0 rounded-4xl py-5 text-2xl bg-amber-900/30 text-white hover:scale-110 active:scale-90"
            :blur="4"
            :refraction="100"
            :edge-intensity="0.5"
            :rim-highlights="0.2"
            @click="router.push('/gallery')"
          >
            My Gallery&nbsp;<ChevronRight />
          </LiquidGlass>
          <LiquidGlass
            class="absolute top-5 right-5 rounded-full w-15 h-15 text-2xl bg-slate-900/30 text-white"
            :blur="1"
            :refraction="50"
            :edge-intensity="2"
            :rim-highlights="0.5"
          >
            <Camera />
          </LiquidGlass>
        </div>
      </div>
    </div>
    <div class="w-full p-10"></div>
  </div>
</template>
<style scoped>
.linearGradientBlue {
  background: linear-gradient(0deg, #1a5aa3c2 0%, #ffffff00 100%);
}
.linearGradientOrange {
  background: linear-gradient(0deg, #a35c1ac2 0%, #ffffff00 100%);
}
</style>
