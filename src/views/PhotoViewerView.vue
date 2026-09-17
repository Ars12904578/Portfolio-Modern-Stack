<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const imageLoaded = ref(false);
const image = computed(() => {
  const source = route.query.src;
  return typeof source === "string" ? source : "";
});
</script>

<template>
  <div class="relative flex h-full w-full items-center justify-center bg-black/30">
      <img
        :src="image"
        alt="Selected photo"
        class="photo h-full w-full object-contain"
        :class="imageLoaded ? 'photo-loaded' : ''"
        @load="imageLoaded = true"
      />
  </div>
</template>

<style scoped>
.photo {
  opacity: 0;
  transform: scale(0.92);
}

.photo-loaded {
  animation: photo-open 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes photo-open {
  from {
    opacity: 0;
    transform: scale(0.92);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>