import { createRouter, createWebHistory } from 'vue-router'

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
      component: () => import("../views/PhotoView.vue"),
    },
  ],
})

export default router
