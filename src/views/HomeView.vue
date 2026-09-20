<script setup lang="ts">
import LiquidGlass from "../components/LiquidGlass.vue";
import { ChevronRight, Code, Camera, Quote } from "@lucide/vue";
import { useRouter } from "vue-router";
const router = useRouter();
</script>

<template>
  <div class="flex flex-col items-center justify-start w-full h-full pb-27 overflow-y-auto">
    <div
      class="min-h-fit shrink-0 grid h-fit w-full grid-cols-1 items-center gap-6 p-6 lg:grid-cols-2 md:gap-10 md:p-10 box-border"
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
            class="cursor-pointer absolute bottom-0 inset-x-0 rounded-4xl py-5 text-2xl bg-cyan-900/50 text-white hover:scale-110 active:scale-90"
            :blur="10"
            @click="router.push('/project')"
          >
            My Projects&nbsp;<ChevronRight />
          </LiquidGlass>
          <LiquidGlass
            class="absolute top-5 right-5 rounded-full w-15 h-15 text-2xl bg-cyan-900/30 text-white"
            :blur="10"
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
            class="cusor-pointer absolute bottom-0 inset-x-0 rounded-4xl py-5 text-2xl bg-yellow-700/20 text-white hover:scale-110 active:scale-90"
            :blur="10"
            @click="router.push('/gallery')"
          >
            My Gallery&nbsp;<ChevronRight />
          </LiquidGlass>
          <LiquidGlass
            class="absolute top-5 right-5 rounded-full w-15 h-15 text-2xl bg-cyan-900/30 text-white"
            :blur="10"
          >
            <Camera />
          </LiquidGlass>
        </div>
      </div>
    </div>
    <!-- Second Page -->
    <div class="w-full min-h-fit shrink-0 box-border px-5 sm:px-20 flex flex-col items-center justify-center gap-5">
      <!-- <div class="w-fit h-fit bg-blue-700/10 rounded-4xl text-2xl p-5 md:p-10 border-5 border-white/30 flex flex-col sm:flex-row gap-5">
        <Quote :size="50" class="min-w-8 min-h-8"/><span>Ever tried. Ever failed. No matter. Try again. Fail again. Fail better. <br> <strong class="truncate">- Samuel Beckett</strong></span>
      </div> -->
      
    </div>
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
