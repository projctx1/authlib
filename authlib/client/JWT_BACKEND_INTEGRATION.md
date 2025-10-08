# 🔐 JWT Backend Integration Guide

## 📋 Current JWT Handling

### **How JWT is Currently Received:**

In the current SDK, JWT tokens are handled in the **auth store** (`src/store/modules/auth.js`):

```javascript
// Current mock implementation
async login({ commit }, credentials) {
  const response = await mockAPI() // Currently returns mock data
  
  // JWT token is stored here
  commit('SET_TOKEN', response.token)  // 'mock-jwt-token'
  commit('SET_USER', response.user)
  
  return response
}
```

### **Token Storage:**
- **Access Token**: Stored in Vuex state + localStorage
- **User Data**: Stored in Vuex state + localStorage  
- **Auto-persistence**: Tokens survive page refreshes

---

## 🚀 Real Backend Integration

### **Step 1: Create API Service Layer**

Create `src/services/api.js`:

```javascript
/**
 * API Service Layer for Real Backend Integration
 */

import axios from 'axios'

// Create axios instance
const API = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:3000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor - Add JWT token to requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle token refresh and errors
API.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config
    
    // Handle 401 Unauthorized (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem('refresh_token')
        if (refreshToken) {
          const response = await axios.post(`${API.defaults.baseURL}/auth/refresh`, {
            refreshToken
          })
          
          const { token } = response.data
          localStorage.setItem('auth_token', token)
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`
          return API(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('auth_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/auth'
      }
    }
    
    return Promise.reject(error)
  }
)

export default API
```

### **Step 2: Create Auth API Methods**

Create `src/services/authAPI.js`:

```javascript
import API from './api.js'

export const authAPI = {
  // Login with email/password
  async login(credentials) {
    const response = await API.post('/auth/login', {
      email: credentials.email,
      password: credentials.password,
      rememberMe: credentials.remember
    })
    
    return {
      user: response.data.user,
      token: response.data.accessToken,
      refreshToken: response.data.refreshToken
    }
  },

  // Register new user
  async register(userData) {
    const response = await API.post('/auth/register', {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      confirmPassword: userData.confirmPassword
    })
    
    return {
      user: response.data.user,
      token: response.data.accessToken,
      refreshToken: response.data.refreshToken
    }
  },

  // Send OTP for login
  async sendLoginOTP(email) {
    const response = await API.post('/auth/send-login-otp', { email })
    return response.data
  },

  // Verify OTP and login
  async verifyLoginOTP(email, code) {
    const response = await API.post('/auth/verify-login-otp', { 
      email, 
      code 
    })
    
    return {
      user: response.data.user,
      token: response.data.accessToken,
      refreshToken: response.data.refreshToken
    }
  },

  // Forgot password
  async forgotPassword(email) {
    const response = await API.post('/auth/forgot-password', { email })
    return response.data
  },

  // Reset password
  async resetPassword(token, password) {
    const response = await API.post('/auth/reset-password', {
      token,
      password
    })
    return response.data
  },

  // Refresh access token
  async refreshToken(refreshToken) {
    const response = await API.post('/auth/refresh', { refreshToken })
    return {
      token: response.data.accessToken,
      refreshToken: response.data.refreshToken
    }
  },

  // Get current user
  async getCurrentUser() {
    const response = await API.get('/auth/me')
    return response.data.user
  },

  // Logout
  async logout() {
    const refreshToken = localStorage.getItem('refresh_token')
    if (refreshToken) {
      await API.post('/auth/logout', { refreshToken })
    }
  }
}
```

### **Step 3: Update Auth Store for Real API**

Update `src/store/modules/auth.js`:

```javascript
import { authAPI } from '../../services/authAPI.js'

export default {
  namespaced: true,
  
  state: {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    token: null,
    refreshToken: null
  },
  
  mutations: {
    SET_USER(state, user) {
      state.user = user
      state.isAuthenticated = !!user
    },
    SET_TOKENS(state, { token, refreshToken }) {
      state.token = token
      state.refreshToken = refreshToken
      
      // Store in localStorage for persistence
      if (token) {
        localStorage.setItem('auth_token', token)
      }
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken)
      }
    },
    SET_LOADING(state, isLoading) {
      state.isLoading = isLoading
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    CLEAR_AUTH(state) {
      state.user = null
      state.isAuthenticated = false
      state.token = null
      state.refreshToken = null
      state.error = null
      
      // Clear localStorage
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('auth_user')
    }
  },
  
  actions: {
    // Login with password
    async login({ commit }, credentials) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        const response = await authAPI.login(credentials)
        
        commit('SET_USER', response.user)
        commit('SET_TOKENS', {
          token: response.token,
          refreshToken: response.refreshToken
        })
        
        return response
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Login failed'
        commit('SET_ERROR', errorMessage)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Register new user
    async register({ commit }, userData) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        const response = await authAPI.register(userData)
        
        commit('SET_USER', response.user)
        commit('SET_TOKENS', {
          token: response.token,
          refreshToken: response.refreshToken
        })
        
        return response
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Registration failed'
        commit('SET_ERROR', errorMessage)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // OTP Login flow
    async sendLoginOTP({ commit }, { email }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        const response = await authAPI.sendLoginOTP(email)
        return response
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to send OTP'
        commit('SET_ERROR', errorMessage)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async verifyLoginOTP({ commit }, { email, code }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        const response = await authAPI.verifyLoginOTP(email, code)
        
        commit('SET_USER', response.user)
        commit('SET_TOKENS', {
          token: response.token,
          refreshToken: response.refreshToken
        })
        
        return response
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'OTP verification failed'
        commit('SET_ERROR', errorMessage)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Logout
    async logout({ commit }) {
      try {
        await authAPI.logout()
      } catch (error) {
        console.error('Logout API call failed:', error)
      } finally {
        commit('CLEAR_AUTH')
      }
    },

    // Initialize auth state from localStorage
    initializeAuth({ commit }) {
      const token = localStorage.getItem('auth_token')
      const refreshToken = localStorage.getItem('refresh_token')
      const user = localStorage.getItem('auth_user')
      
      if (token && user) {
        commit('SET_TOKENS', { token, refreshToken })
        commit('SET_USER', JSON.parse(user))
      }
    },

    // Refresh token
    async refreshToken({ commit, state }) {
      try {
        const response = await authAPI.refreshToken(state.refreshToken)
        commit('SET_TOKENS', {
          token: response.token,
          refreshToken: response.refreshToken
        })
        return response.token
      } catch (error) {
        commit('CLEAR_AUTH')
        throw error
      }
    }
  },
  
  getters: {
    isAuthenticated: state => state.isAuthenticated,
    currentUser: state => state.user,
    isLoading: state => state.isLoading,
    error: state => state.error,
    token: state => state.token
  }
}
```

### **Step 4: Expected Backend API Endpoints**

Your backend should provide these endpoints:

```javascript
// Expected API Response Formats

// POST /auth/login
{
  "user": {
    "id": 123,
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://...",
    "role": "user"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}

// POST /auth/register
{
  "user": {
    "id": 124,
    "name": "Jane Smith", 
    "email": "jane@example.com",
    "avatar": null,
    "role": "user"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

// POST /auth/send-login-otp
{
  "message": "OTP sent successfully",
  "expiresIn": 300
}

// POST /auth/verify-login-otp
{
  "user": { /* user object */ },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

// POST /auth/refresh
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}
```

### **Step 5: Environment Configuration**

Create `.env` files:

```bash
# .env.development
VUE_APP_API_URL=http://localhost:3000/api
VUE_APP_JWT_SECRET=your-dev-secret

# .env.production  
VUE_APP_API_URL=https://api.yourapp.com
VUE_APP_JWT_SECRET=your-production-secret
```

### **Step 6: Initialize Auth on App Start**

Update `src/main.js`:

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'

const app = createApp(App)

app.use(store)
app.use(router)

// Initialize auth state from localStorage
store.dispatch('auth/initializeAuth')

app.mount('#app')
```

---

## 🔒 JWT Security Best Practices

### **Token Storage:**
- ✅ **Access Token**: Short-lived (15-60 minutes)
- ✅ **Refresh Token**: Longer-lived (7-30 days)  
- ✅ **Secure Storage**: localStorage with proper cleanup
- ✅ **Auto-refresh**: Automatic token renewal

### **Security Headers:**
```javascript
// Add to your API requests
headers: {
  'Authorization': `Bearer ${token}`,
  'X-Requested-With': 'XMLHttpRequest',
  'Content-Type': 'application/json'
}
```

### **Token Validation:**
```javascript
// Decode and validate JWT (optional client-side check)
import jwt_decode from 'jwt-decode'

function isTokenValid(token) {
  try {
    const decoded = jwt_decode(token)
    const currentTime = Date.now() / 1000
    return decoded.exp > currentTime
  } catch (error) {
    return false
  }
}
```

---

## 🚀 Quick Migration Steps

1. **Replace mock API calls** in auth store
2. **Add API service layer** with interceptors  
3. **Update environment variables** with your API URL
4. **Test authentication flow** with your backend
5. **Handle error responses** appropriately
6. **Add token refresh logic** for seamless UX

The SDK is designed to make this migration **seamless** - you only need to replace the API calls while keeping all the UI components and state management intact! 🎯
