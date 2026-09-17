<script setup lang="ts">
import LiquidGlass from "@/components/LiquidGlass.vue";
</script>
<template>
  <div
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 h-full w-full items-center justify-center overflow-auto p-2 pb-20"
  >
    <div
      class="w-full h-full aspect-square flex items-center justify-center relative"
      v-for="value in 12"
      :key="value"
    >
      <div class="w-9/10 h-9/10 bg-white/30 rounded-4xl"></div>
	  <LiquidGlass class="absolute bottom-1/20 inset-x-1/20 scale-100 min-h-14 p-0 rounded-4xl bg-slate-700/50 hover:scale-110 active:scale-90 cursor-pointer">Under Development</LiquidGlass>
    </div>
  </div>
</template>
<style scoped></style>
