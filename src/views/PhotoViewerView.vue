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
        class="h-full w-full object-contain transition-opacity duration-300"
        :class="imageLoaded ? 'opacity-100' : 'opacity-0'"
        @load="imageLoaded = true"
      />
  </div>
</template>
