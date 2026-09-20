<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
const imageModules = import.meta.glob(
  "../assets/*.{jpg,jpeg,png,webp,avif}",
  { eager: true, query: "?url", import: "default" },
);
const images = Object.entries(imageModules)
  .sort(([firstPath], [secondPath]) =>
    firstPath.localeCompare(secondPath, undefined, { numeric: true }),
  )
  .map(([, imageUrl]) => imageUrl as string);
</script>
<template>
  <div
    class="grid grid-cols-2 md:grid-cols-3 h-full w-full items-center justify-center overflow-auto"
  >
    <button
      v-for="(image, index) in images"
      :key="image"
      type="button"
      class="group relative w-full h-full min-h-80 overflow-hidden bg-black/20"
      :aria-label="`Open photo ${index + 1}`"
      @click="router.push({ name: 'photo-view', query: { src: image } })"
    >
      <img
        :src="image"
        :alt="`Photo ${index + 1}`"
        loading="lazy"
        decoding="async"
        class="h-full w-full object-cover duration-300 group-hover:scale-105"
      />
    </button>
  </div>
</template>
<style scoped></style>
