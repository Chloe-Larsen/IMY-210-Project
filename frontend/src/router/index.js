import { createRouter, createWebHistory } from 'vue-router'
import UploadView from '../views/UploadView.vue'
import TransformView from '../views/TransformView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'upload',
      component: UploadView
    },
    {
      path: '/transform',
      name: 'transform',
      component: TransformView
    }
  ]
})

export default router
