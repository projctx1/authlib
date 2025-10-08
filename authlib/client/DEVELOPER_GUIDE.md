# 🚀 Vue Auth SDK - Developer Integration Guide

## 📦 Quick Start (3 Steps)

### **Step 1: Install the SDK**
```bash
# Clone or download the SDK
git clone <your-auth-sdk-repo>
cd vue-auth-sdk
npm install
```

### **Step 2: Import into Your Project**
```javascript
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import VueAuthSDK from './path/to/vue-auth-sdk/src/index.js'

const app = createApp(App)
app.use(VueAuthSDK)
app.mount('#app')
```

### **Step 3: Use Components**
```vue
<template>
  <div>
    <!-- Drop-in authentication -->
    <LoginForm @success="handleLogin" />
  </div>
</template>

<script>
export default {
  methods: {
    handleLogin(user) {
      console.log('User logged in:', user)
      this.$router.push('/dashboard')
    }
  }
}
</script>
```

## 🎯 Integration Methods

### **Method 1: Complete Auth Pages (Easiest)**
Use pre-built authentication views:

```vue
<!-- Your router/index.js -->
import { AuthView } from 'vue-auth-sdk'

const routes = [
  { path: '/auth', component: AuthView },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } }
]
```

### **Method 2: Individual Components (Flexible)**
Pick and choose specific components:

```vue
<template>
  <div class="my-auth-page">
    <h1>Welcome to MyApp</h1>
    
    <!-- Use individual components -->
    <LoginForm 
      @success="handleLogin"
      @forgot-password="showForgotPassword"
    />
    
    <!-- Or OTP Login -->
    <OTPLoginForm 
      :email="userEmail"
      @success="handleOTPLogin"
    />
  </div>
</template>

<script>
import { LoginForm, OTPLoginForm } from 'vue-auth-sdk'

export default {
  components: { LoginForm, OTPLoginForm },
  // ... your logic
}
</script>
```

### **Method 3: Headless Integration (Maximum Control)**
Use only the store and build your own UI:

```vue
<template>
  <form @submit.prevent="login">
    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    <button :disabled="isLoading">
      {{ isLoading ? 'Signing in...' : 'Sign In' }}
    </button>
    <div v-if="error" class="error">{{ error }}</div>
  </form>
</template>

<script>
import { useStore } from 'vuex'
import { computed, ref } from 'vue'

export default {
  setup() {
    const store = useStore()
    const email = ref('')
    const password = ref('')
    
    const isLoading = computed(() => store.getters['auth/isLoading'])
    const error = computed(() => store.getters['auth/error'])
    
    const login = async () => {
      await store.dispatch('auth/login', { 
        email: email.value, 
        password: password.value 
      })
    }
    
    return { email, password, isLoading, error, login }
  }
}
</script>
```

## 🎨 Customization Options

### **1. Theme Customization**

#### **CSS Custom Properties (Easiest)**
```css
/* Override default theme */
:root {
  --primary-color: #your-brand-color;
  --bg-primary: #your-background;
  --text-primary: #your-text-color;
  --border-radius-md: 12px; /* More rounded corners */
}

/* Dark theme */
[data-theme="dark"] {
  --primary-color: #your-dark-brand-color;
  --bg-primary: #1a1a1a;
}
```

#### **Custom Theme Object**
```javascript
// themes/custom.js
export const customTheme = {
  colors: {
    primary: '#6366f1',     // Indigo
    secondary: '#8b5cf6',   // Purple
    success: '#10b981',     // Emerald
    error: '#ef4444',       // Red
    warning: '#f59e0b',     // Amber
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  }
}

// Apply theme
import { applyTheme } from 'vue-auth-sdk'
applyTheme(customTheme)
```

### **2. Component Styling**

#### **Scoped Overrides**
```vue
<template>
  <LoginForm class="custom-login" />
</template>

<style scoped>
.custom-login {
  /* Override specific component styles */
  --auth-card-padding: 2rem;
  --auth-input-border-radius: 8px;
}

.custom-login :deep(.auth-button-primary) {
  background: linear-gradient(45deg, #667eea, #764ba2);
  border: none;
  font-weight: 600;
}

.custom-login :deep(.auth-input) {
  border: 2px solid #e5e7eb;
  transition: all 0.3s ease;
}

.custom-login :deep(.auth-input:focus) {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}
</style>
```

#### **Global Style Overrides**
```scss
// styles/auth-overrides.scss
.auth-card {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.auth-button-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transform: translateY(0);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
}
```

### **3. Configuration Options**

#### **SDK Configuration**
```javascript
// auth.config.js
export const authConfig = {
  // API Configuration
  api: {
    baseURL: 'https://your-api.com',
    endpoints: {
      login: '/auth/login',
      register: '/auth/register',
      forgotPassword: '/auth/forgot-password',
      resetPassword: '/auth/reset-password',
      sendOTP: '/auth/send-otp',
      verifyOTP: '/auth/verify-otp',
    },
    timeout: 10000,
  },
  
  // Validation Rules
  validation: {
    password: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSymbols: false,
    },
    email: {
      allowedDomains: ['gmail.com', 'outlook.com', 'company.com'],
      blockDisposable: true,
    }
  },
  
  // OTP Configuration
  otp: {
    length: 6,
    expiryMinutes: 5,
    resendCooldown: 60,
    maxAttempts: 3,
  },
  
  // UI Configuration
  ui: {
    showSocialLogin: true,
    socialProviders: ['google', 'github', 'facebook'],
    showRememberMe: true,
    showForgotPassword: true,
    enableOTPLogin: true,
    defaultTheme: 'light',
  },
  
  // Security
  security: {
    enableCSRF: true,
    sessionTimeout: 3600, // 1 hour
    maxLoginAttempts: 5,
    lockoutDuration: 900, // 15 minutes
  }
}

// Initialize SDK with config
import VueAuthSDK from 'vue-auth-sdk'
app.use(VueAuthSDK, authConfig)
```

### **4. Custom Validation Rules**

```javascript
// validators/custom.js
import { addCustomValidator } from 'vue-auth-sdk'

// Add company email validator
addCustomValidator('companyEmail', (email) => {
  const companyDomains = ['company.com', 'subsidiary.com']
  const domain = email.split('@')[1]
  return companyDomains.includes(domain) || 'Please use your company email'
})

// Add strong password validator
addCustomValidator('strongPassword', (password) => {
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasUpper = /[A-Z]/.test(password)
  const hasLower = /[a-z]/.test(password)
  
  if (!hasSpecialChar) return 'Password must contain a special character'
  if (!hasNumber) return 'Password must contain a number'
  if (!hasUpper) return 'Password must contain an uppercase letter'
  if (!hasLower) return 'Password must contain a lowercase letter'
  
  return true
})
```

### **5. Custom Components**

#### **Extend Existing Components**
```vue
<!-- components/CustomLoginForm.vue -->
<template>
  <div class="custom-login-wrapper">
    <div class="company-logo">
      <img src="/logo.png" alt="Company Logo" />
    </div>
    
    <LoginForm 
      v-bind="$attrs"
      @success="handleSuccess"
      class="company-login"
    >
      <!-- Add custom content to slots -->
      <template #header>
        <h2>Welcome Back to {{ companyName }}</h2>
        <p>Sign in to access your account</p>
      </template>
      
      <template #footer>
        <div class="custom-footer">
          <p>New to {{ companyName }}? 
            <a href="/signup">Create an account</a>
          </p>
          <p class="help-text">
            Need help? <a href="/support">Contact Support</a>
          </p>
        </div>
      </template>
    </LoginForm>
  </div>
</template>

<script>
import { LoginForm } from 'vue-auth-sdk'

export default {
  name: 'CustomLoginForm',
  components: { LoginForm },
  data() {
    return {
      companyName: 'Your Company'
    }
  },
  methods: {
    handleSuccess(user) {
      // Custom success logic
      this.trackLogin(user)
      this.$emit('success', user)
    },
    trackLogin(user) {
      // Analytics tracking
      analytics.track('User Login', {
        userId: user.id,
        method: user.loginMethod || 'password'
      })
    }
  }
}
</script>
```

#### **Build Custom Components**
```vue
<!-- components/CompanyAuthCard.vue -->
<template>
  <div class="company-auth-card">
    <div class="auth-header">
      <img :src="logo" :alt="companyName" class="company-logo" />
      <h1>{{ title }}</h1>
      <p>{{ subtitle }}</p>
    </div>
    
    <div class="auth-content">
      <slot />
    </div>
    
    <div class="auth-footer" v-if="$slots.footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompanyAuthCard',
  props: {
    title: String,
    subtitle: String,
    logo: String,
    companyName: String
  }
}
</script>
```

## 🔌 API Integration

### **Replace Mock API with Real Backend**

```javascript
// services/authAPI.js
import axios from 'axios'

const API = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  timeout: 10000,
})

// Add request interceptor for auth token
API.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authAPI = {
  async login(credentials) {
    const response = await API.post('/auth/login', credentials)
    return response.data
  },
  
  async register(userData) {
    const response = await API.post('/auth/register', userData)
    return response.data
  },
  
  async sendOTP(email) {
    const response = await API.post('/auth/send-otp', { email })
    return response.data
  },
  
  async verifyOTP(email, code) {
    const response = await API.post('/auth/verify-otp', { email, code })
    return response.data
  },
  
  async forgotPassword(email) {
    const response = await API.post('/auth/forgot-password', { email })
    return response.data
  }
}

// Update store to use real API
// store/modules/auth.js
import { authAPI } from '@/services/authAPI'

export default {
  // ... existing code
  actions: {
    async login({ commit }, credentials) {
      commit('SET_LOADING', true)
      try {
        const response = await authAPI.login(credentials)
        commit('SET_USER', response.user)
        commit('SET_TOKEN', response.token)
        return response
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Login failed')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    }
    // ... other actions
  }
}
```

## 🛡️ Authentication Guards

### **Route Protection**
```javascript
// router/guards.js
import store from '@/store'

export const authGuard = (to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated']
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/auth')
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
}

// router/index.js
import { authGuard } from './guards'

const router = createRouter({
  routes: [
    {
      path: '/auth',
      component: AuthView,
      meta: { requiresGuest: true }
    },
    {
      path: '/dashboard',
      component: Dashboard,
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach(authGuard)
```

### **Component-Level Protection**
```vue
<template>
  <div v-if="canAccess">
    <!-- Protected content -->
  </div>
  <div v-else>
    <p>Access denied. Please log in.</p>
  </div>
</template>

<script>
import { useAuthGuard } from 'vue-auth-sdk'

export default {
  setup() {
    const { canAccess, user, isLoading } = useAuthGuard({
      requiresAuth: true,
      roles: ['admin', 'user'],
      permissions: ['read:posts']
    })
    
    return { canAccess, user, isLoading }
  }
}
</script>
```

## 📱 Mobile & PWA Integration

### **Responsive Breakpoints**
```scss
// Use built-in responsive mixins
.my-auth-page {
  @include mobile {
    padding: 1rem;
  }
  
  @include tablet {
    padding: 2rem;
  }
  
  @include desktop {
    padding: 3rem;
  }
}
```

### **PWA Authentication**
```javascript
// composables/usePWAAuth.js
export function usePWAAuth() {
  const store = useStore()
  
  // Biometric authentication
  const authenticateWithBiometrics = async () => {
    if ('credentials' in navigator) {
      try {
        const credential = await navigator.credentials.create({
          publicKey: {
            // WebAuthn configuration
          }
        })
        return credential
      } catch (error) {
        console.error('Biometric auth failed:', error)
      }
    }
  }
  
  // Push notifications for OTP
  const registerForPushOTP = async () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'your-vapid-key'
      })
      
      // Send subscription to server
      await store.dispatch('auth/registerPushOTP', subscription)
    }
  }
  
  return {
    authenticateWithBiometrics,
    registerForPushOTP
  }
}
```

## 🧪 Testing Integration

### **Component Testing**
```javascript
// tests/LoginForm.spec.js
import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import LoginForm from '@/components/LoginForm.vue'

describe('LoginForm', () => {
  let store
  
  beforeEach(() => {
    store = createStore({
      modules: {
        auth: {
          namespaced: true,
          state: { isLoading: false, error: null },
          getters: {
            isLoading: state => state.isLoading,
            error: state => state.error
          },
          actions: {
            login: jest.fn()
          }
        }
      }
    })
  })
  
  it('submits login form with valid data', async () => {
    const wrapper = mount(LoginForm, {
      global: { plugins: [store] }
    })
    
    await wrapper.find('input[type="email"]').setValue('test@example.com')
    await wrapper.find('input[type="password"]').setValue('password123')
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(store.dispatch).toHaveBeenCalledWith('auth/login', {
      email: 'test@example.com',
      password: 'password123',
      remember: false
    })
  })
})
```

## 📊 Analytics & Monitoring

### **Event Tracking**
```javascript
// plugins/analytics.js
export const trackAuthEvent = (event, properties = {}) => {
  // Google Analytics
  if (window.gtag) {
    window.gtag('event', event, properties)
  }
  
  // Custom analytics
  if (window.analytics) {
    window.analytics.track(event, properties)
  }
}

// Usage in components
import { trackAuthEvent } from '@/plugins/analytics'

export default {
  methods: {
    handleLogin(user) {
      trackAuthEvent('User Login', {
        method: 'password',
        userId: user.id
      })
    },
    
    handleOTPLogin(user) {
      trackAuthEvent('User Login', {
        method: 'otp',
        userId: user.id
      })
    }
  }
}
```

## 🎯 Production Deployment

### **Environment Configuration**
```javascript
// .env.production
VUE_APP_API_URL=https://api.yourapp.com
VUE_APP_AUTH_DOMAIN=auth.yourapp.com
VUE_APP_GOOGLE_CLIENT_ID=your-google-client-id
VUE_APP_GITHUB_CLIENT_ID=your-github-client-id

// .env.development
VUE_APP_API_URL=http://localhost:3000
VUE_APP_AUTH_DOMAIN=localhost
```

### **Build Optimization**
```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'auth-sdk': ['vue-auth-sdk'],
          'vendor': ['vue', 'vuex', 'vue-router']
        }
      }
    }
  }
})
```

---

## 🎉 Summary

The Vue Auth SDK provides **three levels of integration**:

1. **🚀 Plug & Play**: Use complete auth views (5 minutes setup)
2. **🎨 Customizable**: Use individual components with custom styling (30 minutes setup)
3. **🔧 Headless**: Use only the store logic with your own UI (1 hour setup)

Choose the approach that best fits your project needs and timeline! The SDK is designed to grow with your requirements - start simple and customize as needed.

**Need help?** Check the examples in `/examples/` or open an issue! 🤝
