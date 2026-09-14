<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const images = ref([
  "/photos/picture (1).jpg",
  "/photos/picture (2).jpg",
  "/photos/picture (3).jpg",
  "/photos/picture (4).jpg",
  "/photos/picture (5).jpg",
  "/photos/picture (6).jpg",
]);
</script>
<template>
  <div
    class="grid grid-cols-2 md:grid-cols-3 h-full w-full items-center justify-center overflow-auto"
  >
    <button
      v-for="(image, index) in images"
      :key="image"
      type="button"
      class="group relative w-full h-full overflow-hidden bg-black/20"
      :aria-label="`Open photo ${index + 1}`"
      @click="router.push({ name: 'photo-view', query: { src: image } })"
    >
      <img
        :src="image"
        :alt="`Photo ${index + 1}`"
        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </button>
  </div>
</template>
<style scoped></style>
