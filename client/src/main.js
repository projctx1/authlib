import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import { tokenRefreshManager } from './services/tokenRefresh.js'
import { errorHandler } from './services/errorHandler.js'
import './styles/main.scss'

const app = createApp(App)

app.use(store)
app.use(router)

// Initialize theme
store.dispatch('ui/initTheme')

// Initialize auth state from secure storage
store.dispatch('auth/initializeAuth').catch(error => {
  console.warn('Auth initialization failed:', error)
})

// Start automatic token refresh
tokenRefreshManager.startAutoRefresh(store)

// Listen for auth logout events
if (typeof window !== 'undefined') {
  window.addEventListener('auth:logout', (event) => {
    console.log('Auth logout event received:', event.detail)
    store.dispatch('auth/logout')
    router.push('/login')
  })
}

app.mount('#app')
