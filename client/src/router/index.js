import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'

// Lazy load views
const AuthView = () => import('../views/AuthView.vue')
const DashboardView = () => import('../views/DashboardView.vue')
const ExampleView = () => import('../../examples/basic-usage.vue')
const ComponentShowcase = () => import('../../examples/component-showcase.vue')

const routes = [
  {
    path: '/',
    redirect: '/auth'
  },
  {
    path: '/auth',
    name: 'auth',
    component: AuthView,
    meta: { requiresGuest: true }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/example',
    name: 'example',
    component: ExampleView,
    meta: { requiresAuth: true }
  },
  {
    path: '/components',
    name: 'components',
    component: ComponentShowcase,
    meta: { requiresAuth: false } // Allow access without auth for demo purposes
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated']
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'auth' })
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router
