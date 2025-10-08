import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import './styles/main.scss'

const app = createApp(App)

app.use(store)
app.use(router)

// Initialize theme
store.dispatch('ui/initTheme')

// Initialize auth state from localStorage
store.dispatch('auth/initializeAuth').catch(error => {
  console.warn('Auth initialization failed:', error)
})

app.mount('#app')
