/**
 * API Service Layer for Backend Integration
 * Handles all HTTP requests with automatic token management
 */

import axios from 'axios'
import { secureStorage } from '../utils/secureStorage.js'

// Create API configuration
const baseURL = import.meta.env.VITE_API_URL || 'https://authlib.vercel.app'

// Export baseURL for use in components
export { baseURL }

// Create axios instance with base configuration
const API = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor - Add JWT token and CSRF protection
API.interceptors.request.use(
  (config) => {
    // Add JWT token from secure storage
    const tokenData = secureStorage.getToken()
    if (tokenData && tokenData.token) {
      config.headers.Authorization = `Bearer ${tokenData.token}`
    }

    // Add CSRF token for state-changing operations
    if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase())) {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content
      if (csrfToken) {
        config.headers['X-CSRF-TOKEN'] = csrfToken
      }
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle errors and token refresh
API.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Prevent infinite loops
    if (originalRequest._retryCount >= 3) {
      console.error('Max retry attempts reached')
      return Promise.reject(error)
    }

    originalRequest._retryCount = (originalRequest._retryCount || 0) + 1

    // Handle 401 Unauthorized (token expired)
    if (error.response?.status === 401 && !originalRequest._isRetry) {
      originalRequest._isRetry = true

      try {
        // Try to refresh token using secure storage
        const tokenData = secureStorage.getToken()
        if (tokenData && tokenData.refreshToken) {
          const response = await axios.post(`${API.defaults.baseURL}/auth/refresh`, {
            refreshToken: tokenData.refreshToken
          })

          if (response.data.success) {
            const { token, refreshToken: newRefreshToken } = response.data.data

            // Update secure storage with new tokens
            secureStorage.setToken(token, newRefreshToken)

            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${token}`
            return API(originalRequest)
          }
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)

        // Clear auth data from secure storage
        secureStorage.clearToken()

        // Emit event instead of hard redirect for better flexibility
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth:logout', {
            detail: { reason: 'token_refresh_failed' }
          }))
        }

        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default API
