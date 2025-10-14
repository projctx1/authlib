import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'


// const AuthView = () => import('../views/AuthView.vue')
const LoginPage = () => import('../views/LoginPage.vue')
const RegisterPage = () => import('../views/RegisterPage.vue')
const VerifyRegistrationPage = () => import('../views/VerifyRegistrationPage.vue')
const VerifyEmailLogin = () => import('../views/VerifyEmailLogin.vue')
const ForgotPasswordPage = () => import('../views/ForgotPasswordPage.vue')
const ResetPasswordPage = () => import('../views/ResetPasswordPage.vue')
const DashboardView = () => import('../views/DashboardView.vue')
const ExampleView = () => import('../../examples/basic-usage.vue')
const ComponentShowcase = () => import('../../examples/component-showcase.vue')
const FlexibilityShowcase = () => import('../../examples/flexibility-showcase.vue')
const AuthShowcase = () => import('../views/AuthShowcase.vue')

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterPage,
    meta: { requiresGuest: true }
  },
  {
    path: '/verify-registration',
    name: 'verify-registration',
    component: VerifyRegistrationPage,
    meta: { requiresGuest: true }
  },
  {
    path: '/verify-email-login',
    name: 'verify-email-login',
    component: VerifyEmailLogin,
    meta: { requiresGuest: true }
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: ForgotPasswordPage,
    meta: { requiresGuest: true }
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: ResetPasswordPage,
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
  },
  {
    path: '/flexibility-showcase',
    name: 'flexibility-showcase',
    component: FlexibilityShowcase,
    meta: { requiresAuth: false } // Allow access without auth for demo purposes
  },
  {
    path: '/auth-showcase',
    name: 'auth-showcase',
    component: AuthShowcase,
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
    next({ name: 'login' })
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router
