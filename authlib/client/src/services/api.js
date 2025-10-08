/**
 * API Service Layer for Backend Integration
 * Handles all HTTP requests with automatic token management
 */

import axios from 'axios'

// Create axios instance with base configuration
const baseURL = import.meta.env.VITE_API_URL || 'https://authlib.vercel.app'

const API = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})


// Request interceptor - Add JWT token to all requests
API.interceptors.request.use(
  (config) => {
    config.withCredentials = false
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

// Response interceptor - Handle errors and token refresh
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
          },
            { withCredentials: false }
          )
          
          if (response.data.success) {
            const { token } = response.data.data
            localStorage.setItem('auth_token', token)
            
            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${token}`
            return API(originalRequest)
          }
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('auth_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('auth_user')
        window.location.href = '/auth'
      }
    }
    
    return Promise.reject(error)
  }
)

export default API
