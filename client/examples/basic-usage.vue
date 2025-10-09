<template>
  <div class="example-app">
    <!-- Navigation -->
    <nav class="navbar">
      <div class="nav-brand">Vue Auth SDK Demo</div>
      <div class="nav-center">
        <router-link to="/components" class="nav-link">
          🧩 Component Showcase
        </router-link>
      </div>
      <div class="nav-actions">
        <button v-if="!isAuthenticated" @click="showAuth = true" class="nav-button">
          Sign In
        </button>
        <div v-else class="user-menu">
          <span>Welcome, {{ currentUser?.name }}!</span>
          <button @click="handleLogout" class="nav-button logout">Logout</button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Authenticated View -->
      <div v-if="isAuthenticated" class="dashboard">
        <h1>Dashboard</h1>
        <div class="feature-grid">
          <div class="feature-card">
            <h3>🔐 Secure Authentication</h3>
            <p>Your authentication is handled securely with JWT tokens.</p>
          </div>
          <div class="feature-card">
            <h3>🎨 Beautiful Components</h3>
            <p>Pre-built Vue components with modern design.</p>
          </div>
          <div class="feature-card">
            <h3>📱 Responsive Design</h3>
            <p>Works perfectly on all devices and screen sizes.</p>
          </div>
        </div>
      </div>

      <!-- Guest View -->
      <div v-else class="landing">
        <div class="hero">
          <h1>Vue Auth SDK</h1>
          <p>A comprehensive authentication solution for Vue.js applications</p>
          <button @click="showAuth = true" class="cta-button">Get Started</button>
        </div>
        
        <div class="features">
          <div class="feature">
            <div class="feature-icon">🔒</div>
            <h3>Secure by Default</h3>
            <p>Built-in security best practices and JWT token management</p>
          </div>
          <div class="feature">
            <div class="feature-icon">⚡</div>
            <h3>Easy Integration</h3>
            <p>Simple setup with minimal configuration required</p>
          </div>
          <div class="feature">
            <div class="feature-icon">🎨</div>
            <h3>Customizable</h3>
            <p>Fully customizable themes and styling options</p>
          </div>
        </div>
      </div>
    </main>

    <!-- Authentication Modal -->
    <div v-if="showAuth" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="closeModal">&times;</button>
        
        <Transition name="slide" mode="out-in">
          <LoginForm
            v-if="authMode === 'login'"
            @success="handleAuthSuccess"
            @switch-to-register="authMode = 'register'"
            @forgot-password="authMode = 'forgot'"
          />
          <RegisterForm
            v-else-if="authMode === 'register'"
            @success="handleRegisterSuccess"
            @switch-to-login="authMode = 'login'"
          />
          <ForgotPasswordForm
            v-else-if="authMode === 'forgot'"
            @success="handleForgotSuccess"
            @back-to-login="authMode = 'login'"
          />
          <OTPVerificationForm
            v-else-if="authMode === 'otp'"
            @success="handleOTPSuccess"
          />
        </Transition>
      </div>
    </div>

    <!-- Theme Toggle -->
    <button class="theme-toggle" @click="toggleTheme">
      <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    </button>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { 
  LoginForm, 
  RegisterForm, 
  ForgotPasswordForm, 
  OTPVerificationForm 
} from 'vue-auth-sdk'

export default {
  name: 'BasicUsageExample',
  components: {
    LoginForm,
    RegisterForm,
    ForgotPasswordForm,
    OTPVerificationForm
  },
  
  setup() {
    const store = useStore()
    const showAuth = ref(false)
    const authMode = ref('login')
    
    const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])
    const currentUser = computed(() => store.getters['auth/currentUser'])
    const isDark = computed(() => store.getters['ui/isDark'])
    
    const closeModal = () => {
      showAuth.value = false
      authMode.value = 'login'
    }
    
    const handleAuthSuccess = () => {
      closeModal()
      store.dispatch('ui/showToast', {
        type: 'success',
        message: 'Welcome back!'
      })
    }
    
    const handleRegisterSuccess = () => {
      authMode.value = 'otp'
      store.dispatch('ui/showToast', {
        type: 'info',
        message: 'Please verify your email address'
      })
    }
    
    const handleForgotSuccess = () => {
      closeModal()
      store.dispatch('ui/showToast', {
        type: 'success',
        message: 'Password reset instructions sent!'
      })
    }
    
    const handleOTPSuccess = () => {
      closeModal()
      store.dispatch('ui/showToast', {
        type: 'success',
        message: 'Account verified successfully!'
      })
    }
    
    const handleLogout = () => {
      store.dispatch('auth/logout')
      store.dispatch('ui/showToast', {
        type: 'info',
        message: 'You have been logged out'
      })
    }
    
    const toggleTheme = () => {
      const newTheme = isDark.value ? 'light' : 'dark'
      store.dispatch('ui/setTheme', newTheme)
    }
    
    return {
      showAuth,
      authMode,
      isAuthenticated,
      currentUser,
      isDark,
      closeModal,
      handleAuthSuccess,
      handleRegisterSuccess,
      handleForgotSuccess,
      handleOTPSuccess,
      handleLogout,
      toggleTheme
    }
  }
}
</script>

<style scoped>
.example-app {
  min-height: 100vh;
  background-color: var(--bg-secondary);
}

.navbar {
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.nav-link {
  padding: 0.5rem 1rem;
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: 0.5rem;
  transition: all 0.2s;
  font-weight: 500;
}

.nav-link:hover {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}

.nav-brand {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.nav-button {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s;
}

.nav-button:hover {
  background-color: var(--bg-tertiary);
}

.nav-button.logout {
  margin-left: 1rem;
  background-color: #fee2e2;
  color: #dc2626;
  border-color: #fecaca;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.main-content {
  padding: 2rem;
}

.landing {
  max-width: 1200px;
  margin: 0 auto;
}

.hero {
  text-align: center;
  padding: 4rem 0;
}

.hero h1 {
  font-size: 3rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.cta-button {
  padding: 1rem 2rem;
  font-size: 1.125rem;
  font-weight: 600;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.cta-button:hover {
  background-color: #2563eb;
  transform: translateY(-2px);
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
}

.feature {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.feature p {
  color: var(--text-secondary);
  line-height: 1.6;
}

.dashboard {
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 2rem;
  text-align: center;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 2rem;
}

.feature-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.feature-card p {
  color: var(--text-secondary);
  line-height: 1.6;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  position: relative;
  max-width: 28rem;
  width: 100%;
}

.modal-close {
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: none;
  background-color: var(--bg-primary);
  color: var(--text-secondary);
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.modal-close:hover {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}

.theme-toggle {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: 1px solid var(--border-color);
  background-color: var(--bg-primary);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.theme-toggle:hover {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  transform: scale(1.1);
}

.theme-toggle svg {
  width: 1.5rem;
  height: 1.5rem;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  transform: translateX(20px);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}

@media (max-width: 768px) {
  .navbar {
    padding: 1rem;
  }
  
  .nav-brand {
    font-size: 1.125rem;
  }
  
  .hero h1 {
    font-size: 2rem;
  }
  
  .hero p {
    font-size: 1rem;
  }
  
  .main-content {
    padding: 1rem;
  }
  
  .features {
    grid-template-columns: 1fr;
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
  }
}
</style>
