/**
 * Vue Auth SDK - Quick Setup Script
 * 
 * This script helps developers quickly integrate the Vue Auth SDK
 * into their existing Vue.js applications with minimal configuration.
 */

import { createStore } from 'vuex'
import { createRouter, createWebHistory } from 'vue-router'

// Import SDK modules
import authModule from '../src/store/modules/auth.js'
import validationModule from '../src/store/modules/validation.js'
import otpModule from '../src/store/modules/otp.js'
import uiModule from '../src/store/modules/ui.js'

// Import SDK components
import AuthView from '../src/views/AuthView.vue'
import DashboardView from '../src/views/DashboardView.vue'
import LoginForm from '../src/components/composites/LoginForm.vue'
import RegisterForm from '../src/components/composites/RegisterForm.vue'
import OTPLoginForm from '../src/components/composites/OTPLoginForm.vue'

// Import SDK styles
import '../src/styles/main.scss'

/**
 * Create Vuex store with auth modules
 */
export function createAuthStore(customConfig = {}) {
  const store = createStore({
    modules: {
      auth: authModule,
      validation: validationModule,
      otp: otpModule,
      ui: uiModule,
      // Add your existing modules here
      ...customConfig.modules
    },
    
    // Global store configuration
    strict: process.env.NODE_ENV !== 'production',
    
    // Add custom plugins
    plugins: [
      // Auto-save auth state to localStorage
      (store) => {
        store.subscribe((mutation) => {
          if (mutation.type === 'auth/SET_TOKEN') {
            localStorage.setItem('auth_token', mutation.payload)
          }
          if (mutation.type === 'auth/SET_USER') {
            localStorage.setItem('auth_user', JSON.stringify(mutation.payload))
          }
          if (mutation.type === 'auth/CLEAR_AUTH') {
            localStorage.removeItem('auth_token')
            localStorage.removeItem('auth_user')
          }
        })
        
        // Restore auth state on app load
        const token = localStorage.getItem('auth_token')
        const user = localStorage.getItem('auth_user')
        
        if (token && user) {
          store.commit('auth/SET_TOKEN', token)
          store.commit('auth/SET_USER', JSON.parse(user))
        }
      },
      
      // Add custom plugins
      ...(customConfig.plugins || [])
    ]
  })
  
  return store
}

/**
 * Create Vue Router with auth routes
 */
export function createAuthRouter(customRoutes = []) {
  // Auth guard middleware
  const authGuard = (to, from, next) => {
    const store = router.app.config.globalProperties.$store
    const isAuthenticated = store.getters['auth/isAuthenticated']
    
    if (to.meta.requiresAuth && !isAuthenticated) {
      next('/auth')
    } else if (to.meta.requiresGuest && isAuthenticated) {
      next('/dashboard')
    } else {
      next()
    }
  }
  
  // Default auth routes
  const authRoutes = [
    {
      path: '/auth',
      name: 'Auth',
      component: AuthView,
      meta: { requiresGuest: true }
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/',
      redirect: '/dashboard'
    }
  ]
  
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      ...authRoutes,
      ...customRoutes
    ]
  })
  
  // Apply auth guard
  router.beforeEach(authGuard)
  
  return router
}

/**
 * Vue Auth SDK Plugin
 */
export const VueAuthSDK = {
  install(app, options = {}) {
    // Create store if not provided
    if (!options.store) {
      options.store = createAuthStore(options.storeConfig)
    }
    
    // Create router if not provided
    if (!options.router) {
      options.router = createAuthRouter(options.customRoutes)
    }
    
    // Install store and router
    app.use(options.store)
    app.use(options.router)
    
    // Register global components
    const components = {
      AuthView,
      LoginForm,
      RegisterForm,
      OTPLoginForm,
      ...options.components
    }
    
    Object.entries(components).forEach(([name, component]) => {
      app.component(name, component)
    })
    
    // Add global properties
    app.config.globalProperties.$auth = {
      // Helper methods
      login: (credentials) => options.store.dispatch('auth/login', credentials),
      logout: () => options.store.dispatch('auth/logout'),
      register: (userData) => options.store.dispatch('auth/register', userData),
      
      // Getters
      get isAuthenticated() {
        return options.store.getters['auth/isAuthenticated']
      },
      get currentUser() {
        return options.store.getters['auth/currentUser']
      },
      get isLoading() {
        return options.store.getters['auth/isLoading']
      }
    }
    
    // Apply custom theme if provided
    if (options.theme) {
      applyTheme(options.theme)
    }
    
    // Initialize UI theme
    options.store.dispatch('ui/initTheme')
  }
}

/**
 * Apply custom theme
 */
export function applyTheme(theme) {
  const root = document.documentElement
  
  // Apply CSS custom properties
  Object.entries(theme.colors || {}).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value)
  })
  
  Object.entries(theme.spacing || {}).forEach(([key, value]) => {
    root.style.setProperty(`--spacing-${key}`, value)
  })
  
  Object.entries(theme.borderRadius || {}).forEach(([key, value]) => {
    root.style.setProperty(`--radius-${key}`, value)
  })
}

/**
 * Composable for authentication
 */
export function useAuth() {
  const { useStore, computed } = require('vue')
  const store = useStore()
  
  const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])
  const currentUser = computed(() => store.getters['auth/currentUser'])
  const isLoading = computed(() => store.getters['auth/isLoading'])
  const error = computed(() => store.getters['auth/error'])
  
  const login = async (credentials) => {
    return await store.dispatch('auth/login', credentials)
  }
  
  const logout = () => {
    store.dispatch('auth/logout')
  }
  
  const register = async (userData) => {
    return await store.dispatch('auth/register', userData)
  }
  
  return {
    isAuthenticated,
    currentUser,
    isLoading,
    error,
    login,
    logout,
    register
  }
}

/**
 * Quick setup function for existing apps
 */
export function quickSetup(app, config = {}) {
  // Default configuration
  const defaultConfig = {
    // Routes to protect
    protectedRoutes: ['/dashboard', '/profile', '/settings'],
    
    // Routes for guests only
    guestRoutes: ['/auth', '/login', '/register'],
    
    // Redirect URLs
    loginRedirect: '/dashboard',
    logoutRedirect: '/auth',
    
    // UI options
    showSocialLogin: true,
    enableOTPLogin: true,
    theme: 'auto'
  }
  
  const finalConfig = { ...defaultConfig, ...config }
  
  // Install the SDK
  app.use(VueAuthSDK, {
    storeConfig: finalConfig.storeConfig,
    customRoutes: finalConfig.customRoutes,
    components: finalConfig.components,
    theme: finalConfig.theme
  })
  
  return app
}

/**
 * Example usage in main.js:
 * 
 * import { createApp } from 'vue'
 * import App from './App.vue'
 * import { quickSetup } from './path/to/vue-auth-sdk/setup/quick-setup.js'
 * 
 * const app = createApp(App)
 * 
 * // Quick setup with defaults
 * quickSetup(app)
 * 
 * // Or with custom configuration
 * quickSetup(app, {
 *   theme: {
 *     colors: {
 *       primary: '#your-brand-color'
 *     }
 *   },
 *   showSocialLogin: false,
 *   enableOTPLogin: true
 * })
 * 
 * app.mount('#app')
 */

// Export individual components for selective imports
export {
  AuthView,
  DashboardView,
  LoginForm,
  RegisterForm,
  OTPLoginForm
}

// Export store modules for custom store setup
export {
  authModule,
  validationModule,
  otpModule,
  uiModule
}
