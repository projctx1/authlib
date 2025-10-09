<template>
  <div class="dashboard-view">
    <header class="dashboard-header">
      <div class="header-content">
        <h1>Dashboard</h1>
        <div class="header-actions">
          <button class="theme-toggle" @click="toggleTheme">
            <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>
          <button class="logout-btn" @click="handleLogout">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </header>

    <main class="dashboard-main">
      <div class="dashboard-content">
        <div class="welcome-card">
          <h2>Welcome back, {{ currentUser?.email || 'User' }}!</h2>
          <p>You have successfully authenticated using the Vue Auth SDK.</p>
          
          <!-- JWT Token Display -->
          <div class="token-section" v-if="authToken">
            <h3>🔑 Your JWT Token</h3>
            <div class="token-display">
              <code class="token-code">{{ authToken }}</code>
              <button class="copy-btn" @click="copyToken" :class="{ copied: tokenCopied }">
                <svg v-if="!tokenCopied" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                {{ tokenCopied ? 'Copied!' : 'Copy' }}
              </button>
            </div>
            <p class="token-info">This token is used to authenticate your API requests.</p>
          </div>
        </div>

        <!-- Navigation Links -->
        <div class="navigation-section">
          <h3>Quick Links</h3>
          <div class="nav-grid">
            <router-link to="/components" class="nav-card">
              <div class="nav-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div class="nav-content">
                <h4>Component Showcase</h4>
                <p>View all authentication components</p>
              </div>
            </router-link>

            <router-link to="/example" class="nav-card">
              <div class="nav-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <div class="nav-content">
                <h4>Code Examples</h4>
                <p>Integration examples and usage</p>
              </div>
            </router-link>

            <button @click="testEndpoints" class="nav-card nav-button">
              <div class="nav-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div class="nav-content">
                <h4>Test Endpoints</h4>
                <p>Test authentication features</p>
              </div>
            </button>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div class="stat-content">
              <h3>Profile</h3>
              <p>Manage your account</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div class="stat-content">
              <h3>Security</h3>
              <p>Two-factor authentication</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div class="stat-content">
              <h3>Settings</h3>
              <p>Customize your experience</p>
            </div>
          </div>
        </div>

        <div class="info-section">
          <h3>Vue Auth SDK Features</h3>
          <div class="features-grid">
            <div class="feature-item">
              <h4>🔐 Secure Authentication</h4>
              <p>JWT token-based authentication with refresh token support</p>
            </div>
            <div class="feature-item">
              <h4>🎨 Beautiful UI Components</h4>
              <p>Pre-built Vue components with SCSS styling and theme support</p>
            </div>
            <div class="feature-item">
              <h4>📱 Responsive Design</h4>
              <p>Mobile-first design that works on all devices</p>
            </div>
            <div class="feature-item">
              <h4>🔄 State Management</h4>
              <p>Vuex integration for centralized authentication state</p>
            </div>
            <div class="feature-item">
              <h4>✅ Form Validation</h4>
              <p>Real-time validation with customizable rules</p>
            </div>
            <div class="feature-item">
              <h4>🌙 Dark Mode</h4>
              <p>Built-in theme switching with CSS custom properties</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'DashboardView',
  
  setup() {
    const store = useStore()
    const router = useRouter()
    const tokenCopied = ref(false)
    
    const currentUser = computed(() => store.getters['auth/currentUser'])
    const authToken = computed(() => store.getters['auth/token'])
    const isDark = computed(() => store.getters['ui/isDark'])
    
    // Log token to console on mount and when it changes
    onMounted(() => {
      if (authToken.value) {
        console.log('🔑 JWT Token:', authToken.value)
        console.log('👤 Current User:', currentUser.value)
      }
    })
    
    const handleLogout = () => {
      store.dispatch('auth/logout')
      router.push('/login')
    }
    
    const toggleTheme = () => {
      const newTheme = isDark.value ? 'light' : 'dark'
      store.dispatch('ui/setTheme', newTheme)
    }
    
    const copyToken = async () => {
      try {
        await navigator.clipboard.writeText(authToken.value)
        tokenCopied.value = true
        setTimeout(() => {
          tokenCopied.value = false
        }, 2000)
      } catch (err) {
        console.error('Failed to copy token:', err)
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = authToken.value
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        tokenCopied.value = true
        setTimeout(() => {
          tokenCopied.value = false
        }, 2000)
      }
    }
    
    const testEndpoints = () => {
      console.log('🧪 Testing Authentication Endpoints...')
      console.log('📋 Available tests:')
      console.log('1. Password Login - Go to /auth and try password login')
      console.log('2. Forgot Password - Click "Forgot Password" on login page')
      console.log('3. Reset Password - Use OTP from forgot password flow')
      console.log('4. Registration - Click "Create Account" on login page')
      console.log('5. OTP Login - Click "Send verification code" on login page')
      console.log('6. Change Password - Use API with current JWT token')
      console.log('🔗 Navigate to /components to see all UI components')
      
      // You can also programmatically test endpoints here
      alert('Check the console for testing instructions!')
    }
    
    return {
      currentUser,
      authToken,
      isDark,
      tokenCopied,
      handleLogout,
      toggleTheme,
      copyToken,
      testEndpoints
    }
  }
}
</script>

<style scoped>
.dashboard-view {
  min-height: 100vh;
  background-color: var(--bg-secondary);
}

.dashboard-header {
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  padding: 1rem 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-content h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.theme-toggle {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: 1px solid var(--border-color);
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.theme-toggle:hover {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
}

.theme-toggle svg {
  width: 1.25rem;
  height: 1.25rem;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.logout-btn:hover {
  background-color: var(--bg-tertiary);
}

.logout-btn svg {
  width: 1rem;
  height: 1rem;
}

.dashboard-main {
  padding: 2rem 0;
}

.dashboard-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.welcome-card {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: center;
}

.welcome-card h2 {
  font-size: 1.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.welcome-card p {
  color: var(--text-secondary);
  font-size: 1.125rem;
}

.token-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

.token-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
  text-align: left;
}

.token-display {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  margin-bottom: 0.75rem;
}

.token-code {
  flex: 1;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.75rem;
  color: var(--text-primary);
  background-color: transparent;
  padding: 0.5rem;
  border-radius: 0.25rem;
  word-break: break-all;
  line-height: 1.4;
  max-height: 4rem;
  overflow-y: auto;
}

.copy-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
  white-space: nowrap;
}

.copy-btn:hover {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
}

.copy-btn.copied {
  background-color: #10b981;
}

.copy-btn svg {
  width: 1rem;
  height: 1rem;
}

.token-info {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
  text-align: left;
}

.navigation-section {
  margin-bottom: 3rem;
}

.navigation-section h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  text-align: left;
}

.nav-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.nav-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
  cursor: pointer;
}

.nav-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: var(--primary-color);
}

.nav-button {
  background: none;
  border: 1px solid var(--border-color);
  width: 100%;
  text-align: left;
}

.nav-button:hover {
  background-color: var(--bg-primary);
}

.nav-icon {
  width: 3rem;
  height: 3rem;
  background-color: var(--primary-light);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.nav-icon svg {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--primary-color);
}

.nav-content h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
}

.nav-content p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.2s;
  cursor: pointer;
}

.stat-card:hover {
  border-color: #3b82f6;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  background-color: #dbeafe;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon svg {
  width: 1.5rem;
  height: 1.5rem;
  color: #3b82f6;
}

.stat-content h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.stat-content p {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.info-section {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  padding: 2rem;
}

.info-section h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  text-align: center;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.feature-item {
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
}

.feature-item h4 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.feature-item p {
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .header-content {
    padding: 0 1rem;
  }
  
  .header-content h1 {
    font-size: 1.25rem;
  }
  
  .logout-btn span {
    display: none;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
