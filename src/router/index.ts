import { createRouter, createWebHistory } from 'vue-router'
import IntroView from '../views/IntroView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'intro',
      component: IntroView,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue')
  },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/esocial/processing',
      name: 'esocial-processing',
      component: () => import('../views/ESocialProcessingView.vue'),
    },
    {
      path: '/esocial/processing-page',
      name: 'esocial-processing-page',
      component: () => import('../components/esocial/ESocialProcessingPage.vue'),
    },
    {
      path: '/esocial/xml-view',
      name: 'esocial-xml-view',
      component: () => import('../components/esocial/ESocialXMLViewPage.vue'),
    },
    {
      path: '/esocial/summary',
      name: 'esocial-summary',
      component: () => import('../components/esocial/ESocialSummaryPage.vue'),
    },
    {
      path: '/esocial/exclusions',
      name: 'esocial-exclusions',
      component: () => import('../components/esocial/ESocialS3000Page.vue'),
    },
  ],
})

export default router
