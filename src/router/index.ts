import { ref } from "vue";
import { createRouter, createWebHistory } from "vue-router";

export const isRouteLoading = ref(false);

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: "home",
      path: "/",
      component: () => import("../views/HomeView.vue"),
    },
    {
      name: "projects",
      path: "/project",
      component: () => import("../views/ProjectsView.vue"),
    },
    {
      name: "photo",
      path: "/gallery",
      component: () => import("../views/PhotosView.vue"),
    },
    {
      name: "photo-view",
      path: "/gallery/photo",
      component: () => import("../views/PhotoViewerView.vue"),
    },
  ],
});

router.beforeEach(() => {
  isRouteLoading.value = true;
});

router.afterEach(() => {
  isRouteLoading.value = false;
});

router.onError(() => {
  isRouteLoading.value = false;
});

export default router
